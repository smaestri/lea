package lea.controller;

import lea.commun.StatutEmprunt;
import lea.dto.CountBean;
import lea.dto.EmpruntBean;
import lea.dto.RefusBean;
import lea.modele.*;
import lea.repository.emprunt.EmpruntRepository;
import lea.repository.livremodel.LivreModelRepository;
import lea.repository.livremodel.MongoLivreModelRepository;
import lea.repository.user.MongoUserRepository;
import lea.repository.user.UserRepository;
import lea.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.ServletException;
import java.io.IOException;
import java.text.ParseException;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
public class EmpruntController extends CommonController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MongoUserRepository mongoUserRepository;

    @Autowired
    private EmpruntRepository empruntRepository;

    @Autowired
    private MongoLivreModelRepository mongoLivreModelRepository;

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
    public List<Emprunt> livresHandlerPrets() throws ServletException, IOException {
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
        return isNewPret(prets) ? "1" : "0";
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
        this.empruntRepository.saveEmprunt(emprunt);
        this.userRepository.updateBookStatus(proprietaire, emprunt.getLivreId(), StatutEmprunt.REQUESTED);

        try {
            Optional<Livre> livre = proprietaire.getLivre(empruntBean.getIdLivre());
            //retrieve book information
            Optional<LivreModel> livreModel = this.mongoLivreModelRepository.findById(livre.get().getLivreModelId());
            String titreBook = livreModel.get().getTitreBook();
            String content = "Livres entre Amis - nouvelle demande d'emprunt de la part de " + principal.getFullName() /*+  txtIntermediaire*/ + " pour le livremodel '" + titreBook + "'. Connectez-vous au site pour consulter et accepter cet emprunt!";
            String object = "Nouvelle demande d'emprunt";
            notificationService.sendNotificaition(proprietaire.getEmail(), object, content);
        } catch (Exception e) {
            // catch error
            System.out.println("Error Sending Email: " + e.getMessage());
        }
        return "redirect:/emprunts";
    }


    @RequestMapping(value = "/api/accepterEmprunt/{empruntId}", method = RequestMethod.POST)
    public String accepterEmprunt(@PathVariable("empruntId") String empruntId) throws Exception {
        Utilisateur principal = getPrincipal();
        Emprunt emprunt = empruntRepository.findOne(empruntId);

        this.userRepository.updateBookStatus(principal, emprunt.getLivreId(), StatutEmprunt.CURRENT);
        emprunt.setActif(true);
        emprunt.setDateAccept(new Date());
        empruntRepository.saveEmprunt(emprunt);


        String emprunteurId = emprunt.getEmprunteurId();
        Utilisateur userConnected = mongoUserRepository.findById(principal.getId()).get();
        Utilisateur emprunteur = mongoUserRepository.findById(emprunteurId).get();
        // if not friend add it in both ways
        if (!(principal.getListFriendsId().contains(emprunt.getEmprunteurId()))) {
            addRealFriendAndDeletePending(userConnected, emprunteur);
            addRealFriendAndDeletePending(emprunteur, userConnected);
        }
        Utilisateur preteur = mongoUserRepository.findById(emprunt.getPreteurId()).get();
        Optional<LivreModel> livreModel = this.mongoLivreModelRepository.findById(emprunt.getLivre().getLivreModelId());
        String titreBook = livreModel.get().getTitreBook();
        String content = preteur.getFullName() + " a accepté votre demande d'emprunt pour le livremodel " + titreBook + ". Connectez-vous au site pour retourner le livremodel une fois que vous l'avez lu!";
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
        Utilisateur emprunteur = mongoUserRepository.findById(emprunt.getEmprunteurId()).get();
        String content = principal.getFullName() + " a refusé votre demande d'emprunt avec le motif :" + refusBean.getRefus() + ". Le livremodel est à nouveau empruntable.";
        String object = "Refus de la demande d'emprunt";
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
        Utilisateur preteur = mongoUserRepository.findById(emprunt.getPreteurId()).get();
        this.userRepository.updateBookStatus(preteur, emprunt.getLivreId(), StatutEmprunt.SENT);
        emprunt.setActif(true);
        emprunt.setDateEnvoi(new Date());
        empruntRepository.saveEmprunt(emprunt);
        Optional<Livre> livre = userRepository.findBook(emprunt.getLivreId());
        Utilisateur emprunteur = mongoUserRepository.findById(emprunt.getEmprunteurId()).get();
        String object = "L'emprunteur vous a renvoyé le livremodel";
        Optional<LivreModel> livreModel = this.mongoLivreModelRepository.findById(emprunt.getLivre().getLivreModelId());
        String titreBook = livreModel.get().getTitreBook();
        String content = emprunteur.getFullName() + " vous a renvoyé le livremodel " + titreBook+ ". Vous pouvez donc clore l'emprunt en vous connectant au site!";
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
        Utilisateur emprunteur = mongoUserRepository.findById(emprunt.getEmprunteurId()).get();
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
    public CountBean countEmpruntAndPret() {
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
        emp.setPreteur(mongoUserRepository.findById(emp.getPreteurId()).get());
        emp.setEmprunteur(mongoUserRepository.findById(emp.getEmprunteurId()).get());
        Livre book = userRepository.findBook(emp.getLivreId()).get();
        LivreModel livreModel = this.mongoLivreModelRepository.findById(book.getLivreModelId()).get();
        book.setLivreModel(livreModel);
        setCommentuser(emp);
        emp.setLivre(book);
    }

    private boolean isNewPret(List<Emprunt> listeEmp) {
        for (Emprunt emp : listeEmp) {
            Optional<Livre> book = userRepository.findBook(emp.getLivreId());
            if (book.isPresent() && book.get().getStatut().equals(StatutEmprunt.REQUESTED)) {
                return true;
            }
        }
        return false;
    }

    private void setCommentuser(Emprunt emp) {
        for (Commentaire comm : emp.getCommentaires()) {
            Utilisateur auteurComm = mongoUserRepository.findById(comm.getAuteur()).get();
            comm.setUser(auteurComm);
        }
    }
    private void addRealFriendAndDeletePending(Utilisateur user, Utilisateur friend) {
        user.getListFriendsId().add(friend.getId());
        userRepository.saveUser(user);

        // find my pending friend from this user
        PendingFriend pf = userRepository.findPendingFriend(user, friend.getEmail());
        if (pf != null) {
            userRepository.deletePendingFriend(user, pf.getId());
        }
    }
}