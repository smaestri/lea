package lea.controller;

import lea.commun.StatutEmprunt;
import lea.dto.CountBean;
import lea.dto.EmpruntBean;
import lea.dto.RefusBean;
import lea.modele.Commentaire;
import lea.modele.Emprunt;
import lea.modele.Livre;
import lea.modele.Utilisateur;
import lea.repository.emprunt.EmpruntRepository;
import lea.repository.user.UserRepository;
import lea.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import javax.servlet.ServletException;
import java.io.IOException;
import java.text.ParseException;
import java.util.Date;
import java.util.List;

@RestController
public class EmpruntController extends CommonController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private EmpruntRepository empruntRepository;
    @Autowired
    private NotificationService notificationService;

    @RequestMapping(value = "/emprunts", method = RequestMethod.GET)
    public List<Emprunt> livresHandler() throws ServletException, IOException {
        Utilisateur principal = getPrincipal();
        List<Emprunt> emprunts = empruntRepository.findEmprunts(principal.getId(), true);
        setEmpruntobjects(emprunts);
        return emprunts;
    }

    @RequestMapping(value = "/prets", method = RequestMethod.GET)
    public  List<Emprunt> livresHandlerPrets() throws ServletException, IOException {
        Utilisateur principal = getPrincipal();
        List<Emprunt> prets = empruntRepository.findPrets(principal.getId(), true);
        setIntermediaire(principal, prets, false);
        setEmpruntobjects(prets);
        return prets;
    }

    private void setIntermediaire(Utilisateur principal, List<Emprunt> prets, boolean isEmprunt) {
        for (Emprunt emprunt : prets) {
            try {
                Utilisateur intermediaire = this.findIntermediaire(principal.getId(), isEmprunt ? emprunt.getPreteurId() : emprunt.getEmprunteurId());
                if (intermediaire != null) {
                    emprunt.setIntermediaire(intermediaire.getFullName());
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    private void setEmpruntobjects(List<Emprunt> listeEmp) {
        for (Emprunt emp : listeEmp) {
            emp.setPreteur(userRepository.findOne(emp.getPreteurId()));
            emp.setEmprunteur(userRepository.findOne(emp.getEmprunteurId()));
            Livre book = userRepository.findBook(emp.getLivreId());
            book.setImage("assets/img/book.png");
            setCommentuser(emp);
            emp.setLivre(book);
        }
    }


    private void setCommentuser(Emprunt emp){
        for(Commentaire comm : emp.getCommentaires()){
            Utilisateur auteurComm = userRepository.findOne(comm.getAuteur());
            comm.setUser(auteurComm);
        }
    }


    @RequestMapping(value = "/emprunter", method = RequestMethod.POST)
    public String processNewEmpruntForm(@RequestBody EmpruntBean empruntBean) throws ParseException {
        Utilisateur principal = getPrincipal();
        Utilisateur proprietaire = userRepository.findproprietaire(empruntBean.getIdLivre());
        Emprunt emprunt = new Emprunt();
        emprunt.setActif(true);
        emprunt.setDateDemande(new Date());
        emprunt.setEmprunteurId(principal.getId());
        emprunt.setPreteurId(proprietaire.getId());
        emprunt.setLivreId(empruntBean.getIdLivre());
        if (!StringUtils.isEmpty(empruntBean.getTxtRencontre())) {
            Commentaire comm = new Commentaire();
            comm.setMessage(empruntBean.getTxtRencontre());
            comm.setAuteur(principal.getId());
            emprunt.getCommentaires().add(comm);
        }
        this.empruntRepository.saveEmprunt(emprunt);
        this.userRepository.updateBookStatus(proprietaire, emprunt.getLivreId(), StatutEmprunt.REQUESTED);

        Utilisateur intermediaire;
        String txtIntermediaire = "";
        try {
            intermediaire = this.findIntermediaire(principal.getId(), emprunt.getPreteurId());
            if (intermediaire != null) {
                txtIntermediaire = " (ami de " + intermediaire.getFullName() + ")";
            }
        } catch (Exception e) {
            // logger.error("Erreur pour trouver l'ami intermediaire");
            return null;
        }

        try {
            Livre livre = proprietaire.getLivre(empruntBean.getIdLivre());
            String content = "Livres entre Amis - nouvelle demande d'emprunt de la part de " + principal.getFullName() + txtIntermediaire + " pour le livre '" + livre.getTitreBook() + "'. Connectez-vous au site pour consulter et accepter cet emprunt!";
            String object = "Nouvelle demande d'emprunt";
            notificationService.sendNotificaition(proprietaire.getEmail(),object, content );
        }catch( Exception e ){
            // catch error
            System.out.println("Error Sending Email: " + e.getMessage());
        }

        return "redirect:/emprunts";
    }


    private Utilisateur findIntermediaire(String userIdSource, String userIdToFind) throws Exception {
        boolean amiDirect = false;
        Utilisateur userSource = this.userRepository.findOne(userIdToFind);
        Utilisateur userToFind = this.userRepository.findOne(userIdSource);

        for (String friendId : userSource.getListFriendsId()) {
            if (friendId.equalsIgnoreCase(userToFind.getId())) {
                amiDirect = true;
            }
        }

        if (!amiDirect) {
            Utilisateur intermediaire = userRepository.findIntermediaire(userSource, userToFind.getId());
            if (intermediaire == null) {
                return null;
            } else {
                return intermediaire;
            }
        }
        return null;
    }

    @RequestMapping(value = "/accepterEmprunt/{empruntId}", method = RequestMethod.POST)
    public String accepterEmprunt(@PathVariable("empruntId") String empruntId) throws Exception {
        Utilisateur principal = getPrincipal();
        Emprunt emprunt = empruntRepository.findOne(empruntId);
        if (!principal.getId().equals(emprunt.getPreteurId())) {
            throw new Exception("Probleme de securite");
        }
        this.userRepository.updateBookStatus(principal, emprunt.getLivreId(), StatutEmprunt.CURRENT);
        emprunt.setActif(true);
        emprunt.setDateAcceptOrRefus(new Date());
        empruntRepository.saveEmprunt(emprunt);
        String emprunteurId = emprunt.getEmprunteurId();
        Utilisateur emprunteur = userRepository.findOne(emprunteurId);
        Utilisateur preteur = userRepository.findOne(emprunt.getPreteurId());
        String content = preteur.getFullName() + " a accepté votre demande d'emprunt pour le livre " + preteur.getLivre(emprunt.getLivreId()).getTitreBook() + ". Connectez-vous au site pour retourner le livre une fois que vous l'avez lu!";
        String object = "Le prêteur a accepté votre demande d'emprunt!";
        notificationService.sendNotificaition(principal.getEmail(), object, content);
        return "OK";
    }

    @RequestMapping(value = "/refuserEmprunt/{empruntId}", method = RequestMethod.POST)
    public String refuserEmprunt(@PathVariable("empruntId") String empruntId, @RequestBody RefusBean refusBean) throws Exception {
        Utilisateur principal = getPrincipal();
        Emprunt emprunt = empruntRepository.findOne(empruntId);
        if (!principal.getId().equals(emprunt.getPreteurId())) {
            throw new Exception("Probleme de securite");
        }
        this.userRepository.updateBookStatus(principal, emprunt.getLivreId(), StatutEmprunt.FREE);
        emprunt.setActif(false);
        emprunt.setDateAcceptOrRefus(new Date());
        emprunt.setMotifRefus(refusBean.getRefus());
        empruntRepository.saveEmprunt(emprunt);
        Utilisateur emprunteur = userRepository.findOne(emprunt.getEmprunteurId());
        String content = principal.getFullName() + " a refusé votre demande d'emprunt avec le motif :" + refusBean.getRefus() + ". Le livre est à nouveau empruntable.";
        String object =  "Refus de la demande d'emprunt";
        notificationService.sendNotificaition(emprunteur.getEmail(), object, content);

        return "OK";
    }

    @RequestMapping(value = "/envoyerEmprunt/{empruntId}", method = RequestMethod.POST)
    public String sendEmprunt(@PathVariable("empruntId") String empruntId) throws Exception {
        Utilisateur principal = getPrincipal();
        Emprunt emprunt = empruntRepository.findOne(empruntId);
        if (!principal.getId().equals(emprunt.getEmprunteurId())) {
            throw new Exception("Probleme de securite");
        }
        Utilisateur preteur = userRepository.findOne(emprunt.getPreteurId());
        this.userRepository.updateBookStatus(preteur, emprunt.getLivreId(), StatutEmprunt.SENT);
        emprunt.setActif(true);
        emprunt.setDateEnvoi(new Date());
        empruntRepository.saveEmprunt(emprunt);
        Livre livre = userRepository.findBook(emprunt.getLivreId());
        Utilisateur emprunteur = userRepository.findOne(emprunt.getEmprunteurId());
        String object =  "L'emprunteur vous a renvoyé le livre";
        String content = emprunteur.getFullName() + " vous a renvoyé le livre " + livre.getTitreBook() +". Vous pouvez donc clore l'emprunt en vous connectant au site!";
        notificationService.sendNotificaition(preteur.getEmail(), object, content);

        return "OK";
    }

    @RequestMapping(value = "/cloreEmprunt/{empruntId}", method = RequestMethod.POST)
    public String cloreEmprunt(@PathVariable("empruntId") String empruntId) throws Exception {
        Utilisateur principal = getPrincipal();
        Emprunt emprunt = empruntRepository.findOne(empruntId);
        if (!principal.getId().equals(emprunt.getPreteurId())) {
            throw new Exception("Probleme de securite");
        }
        this.userRepository.updateBookStatus(principal, emprunt.getLivreId(), StatutEmprunt.FREE);
        emprunt.setActif(false);
        emprunt.setDateCloture(new Date());
        empruntRepository.saveEmprunt(emprunt);
        Utilisateur emprunteur = userRepository.findOne(emprunt.getEmprunteurId());
        String content = "Le preteur a clot l'emprunt. Vous pouvez consulter celui-ci dans votre compte, à la rubrique 'Vos emprunts historiés'.";
        String object = "Le preteur a clos l'emprunt.";
        notificationService.sendNotificaition(emprunteur.getEmail(), object, content);
        return "OK";
    }

    //TODO PERF
    @RequestMapping(value = "/countEmpruntAndPret", method = RequestMethod.GET)
    public CountBean countEmpruntAndPret(){
        Utilisateur principal = getPrincipal();
        CountBean cbean = new CountBean();
        List<Emprunt> emprunts = empruntRepository.findEmprunts(principal.getId(), true);
        List<Emprunt> prets = empruntRepository.findPrets(principal.getId(), true);
        cbean.setNbEmprunt(emprunts.size());
        cbean.setNbPret(prets.size());
        return cbean;

    }
}