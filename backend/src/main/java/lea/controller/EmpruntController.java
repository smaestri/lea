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

    @RequestMapping(value = "/api/emprunts", method = RequestMethod.GET)
    public List<Emprunt> livresHandler() throws ServletException, IOException {
        Utilisateur principal = getPrincipal();
        List<Emprunt> emprunts = empruntRepository.findEmprunts(principal.getId(), true);
        setListEmpruntobjects(emprunts);
        return emprunts;
    }


    @RequestMapping(value = "/api/prets", method = RequestMethod.GET)
    public  List<Emprunt> livresHandlerPrets() throws ServletException, IOException {
        Utilisateur principal = getPrincipal();
        List<Emprunt> prets = empruntRepository.findPrets(principal.getId(), true);
        setListEmpruntobjects(prets);
        return prets;
    }

    @RequestMapping(value = "/api/emprunts/{empruntId}", method = RequestMethod.GET)
    public Emprunt empruntDetail(@PathVariable("empruntId") String empruntId) {
        Emprunt emprunt = empruntRepository.findOne(empruntId);
        setEmpruntobjects(emprunt);
        return emprunt;
    }

    @RequestMapping(value = "/api/isNewPret", method = RequestMethod.GET)
    public String findNouveauPret() throws ServletException, IOException {
        Utilisateur principal = getPrincipal();
        List<Emprunt> prets = empruntRepository.findPrets(principal.getId(), true);
        setListEmpruntobjects(prets);
        return isNewPret(prets)?"1":"0";
    }

    @RequestMapping(value = "/api/emprunter", method = RequestMethod.POST)
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


        // Not implemented : you have to add as friend to loan book

        //        String txtIntermediaire ="";
        //        if(empruntBean.getIdIntermediaire() != null){
        //            Utilisateur one = userRepository.findOne(empruntBean.getIdIntermediaire());
        //            txtIntermediaire = txtIntermediaire + " par l'intermédiaire de " + one.getFullName();
        //        }

        try {
            Livre livre = proprietaire.getLivre(empruntBean.getIdLivre());
            String content = "Livres entre Amis - nouvelle demande d'emprunt de la part de " + principal.getFullName() /*+  txtIntermediaire*/ + " pour le livre '" + livre.getTitreBook() + "'. Connectez-vous au site pour consulter et accepter cet emprunt!";
            String object = "Nouvelle demande d'emprunt";
            notificationService.sendNotificaition(proprietaire.getEmail(),object, content );
        }catch( Exception e ){
            // catch error
            System.out.println("Error Sending Email: " + e.getMessage());
        }
        return "redirect:/emprunts";
    }


    @RequestMapping(value = "/api/accepterEmprunt/{empruntId}", method = RequestMethod.POST)
    public String accepterEmprunt(@PathVariable("empruntId") String empruntId) throws Exception {
        Utilisateur principal = getPrincipal();
        Emprunt emprunt = empruntRepository.findOne(empruntId);
        if (!principal.getId().equals(emprunt.getPreteurId())) {
            throw new Exception("Probleme de securite");
        }
        this.userRepository.updateBookStatus(principal, emprunt.getLivreId(), StatutEmprunt.CURRENT);
        emprunt.setActif(true);
        emprunt.setDateAccept(new Date());
        empruntRepository.saveEmprunt(emprunt);
        String emprunteurId = emprunt.getEmprunteurId();
        Utilisateur emprunteur = userRepository.findOne(emprunteurId);
        Utilisateur preteur = userRepository.findOne(emprunt.getPreteurId());
        String content = preteur.getFullName() + " a accepté votre demande d'emprunt pour le livre " + preteur.getLivre(emprunt.getLivreId()).getTitreBook() + ". Connectez-vous au site pour retourner le livre une fois que vous l'avez lu!";
        String object = "Le prêteur a accepté votre demande d'emprunt!";
        notificationService.sendNotificaition(emprunteur.getEmail(), object, content);
        return "OK";
    }

    @RequestMapping(value = "/api/refuserEmprunt/{empruntId}", method = RequestMethod.POST)
    public String refuserEmprunt(@PathVariable("empruntId") String empruntId, @RequestBody RefusBean refusBean) throws Exception {
        Utilisateur principal = getPrincipal();
        Emprunt emprunt = empruntRepository.findOne(empruntId);
        if (!principal.getId().equals(emprunt.getPreteurId())) {
            throw new Exception("Probleme de securite");
        }
        this.userRepository.updateBookStatus(principal, emprunt.getLivreId(), StatutEmprunt.FREE);
        emprunt.setActif(false);
        emprunt.setDateRefus(new Date());
        emprunt.setMotifRefus(refusBean.getRefus());
        empruntRepository.saveEmprunt(emprunt);
        Utilisateur emprunteur = userRepository.findOne(emprunt.getEmprunteurId());
        String content = principal.getFullName() + " a refusé votre demande d'emprunt avec le motif :" + refusBean.getRefus() + ". Le livre est à nouveau empruntable.";
        String object =  "Refus de la demande d'emprunt";
        notificationService.sendNotificaition(emprunteur.getEmail(), object, content);

        return "OK";
    }

    @RequestMapping(value = "/api/envoyerEmprunt/{empruntId}", method = RequestMethod.POST)
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

    @RequestMapping(value = "/api/cloreEmprunt/{empruntId}", method = RequestMethod.POST)
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

    @RequestMapping(value = "/api/historized-loans", method = RequestMethod.GET)
    public List<Emprunt> empruntsHistories() throws ServletException, IOException {
        Utilisateur userConnected = getPrincipal();
        List<Emprunt> emprunts = empruntRepository.findEmprunts(userConnected.getId(), false);

        for (Emprunt emp : emprunts) {
            this.setEmpruntobjects(emp);
        }
        return emprunts;
    }

    @RequestMapping(value = "/api/historized-lendings", method = RequestMethod.GET)
    public List<Emprunt> pretHistories() throws ServletException, IOException {
        Utilisateur userConnected = getPrincipal();
        List<Emprunt> prets = empruntRepository.findPrets(userConnected.getId(), false);

        for (Emprunt pret : prets) {
            this.setEmpruntobjects(pret);
        }

        return prets;
    }

    //TODO PERF
    @RequestMapping(value = "/api/countEmpruntAndPret", method = RequestMethod.GET)
    public CountBean countEmpruntAndPret(){
        Utilisateur principal = getPrincipal();
        CountBean cbean = new CountBean();
        List<Emprunt> emprunts = empruntRepository.findEmprunts(principal.getId(), true);
        List<Emprunt> prets = empruntRepository.findPrets(principal.getId(), true);
        cbean.setNbEmprunt(emprunts.size());
        cbean.setNbPret(prets.size());
        return cbean;

    }

    private void setListEmpruntobjects(List<Emprunt> listeEmp) {
        for (Emprunt emp : listeEmp) {
            setEmpruntobjects(emp);
        }
    }

    private void setEmpruntobjects(Emprunt emp) {
            emp.setPreteur(userRepository.findOne(emp.getPreteurId()));
            emp.setEmprunteur(userRepository.findOne(emp.getEmprunteurId()));
            Livre book = userRepository.findBook(emp.getLivreId());
            setCommentuser(emp);
            emp.setLivre(book);
    }

    private boolean isNewPret(List<Emprunt> listeEmp) {
        for (Emprunt emp : listeEmp) {
            Livre book = userRepository.findBook(emp.getLivreId());
            if(book.getStatut().equals(StatutEmprunt.REQUESTED)){
                return true;
            }
        }
        return false;
    }


    private void setCommentuser(Emprunt emp){
        for(Commentaire comm : emp.getCommentaires()){
            Utilisateur auteurComm = userRepository.findOne(comm.getAuteur());
            comm.setUser(auteurComm);
        }
    }

}