package lea.controller;

import lea.commun.StatutEmprunt;
import lea.dto.CountBean;
import lea.dto.EmpruntBean;
import lea.dto.RefusBean;
import lea.modele.*;
import lea.repository.emprunt.EmpruntRepository;
import lea.repository.livremodel.MongoLivreModelRepository;
import lea.repository.user.MongoUserRepository;
import lea.repository.user.UserRepository;
import lea.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.ServletException;
import java.io.IOException;
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
        Utilisateur userConnected = mongoUserRepository.findById(principal.getId()).get();
        List<Emprunt> prets = empruntRepository.findPrets(principal.getId(), true);
        setListEmpruntobjects(prets);
        return isNewPret(prets, userConnected) ? "1" : "0";
    }

    @RequestMapping(value = "/api/emprunter", method = RequestMethod.POST)
    public String processNewEmpruntForm(@RequestBody EmpruntBean empruntBean) {
        Utilisateur principal = getPrincipal();
        Utilisateur proprietaire = userRepository.findproprietaire(empruntBean.getIdLivre());
        Emprunt emprunt = new Emprunt();
        emprunt.setActif(true);
        emprunt.setDateDemande(new Date());
        emprunt.setEmprunteurId(principal.getId());
        emprunt.setPreteurId(proprietaire.getId());
        emprunt.setLivreId(empruntBean.getIdLivre());
        Optional<Livre> livre = proprietaire.getLivre(empruntBean.getIdLivre());
        Optional<LivreModel> livreModel = this.mongoLivreModelRepository.findById(livre.get().getLivreModelId());
        emprunt.setLivreModelId(livreModel.get().getId());
        this.empruntRepository.saveEmprunt(emprunt);

        this.userRepository.updateBookStatus(proprietaire, emprunt.getLivreId(), StatutEmprunt.REQUESTED);

        String titreBook = livreModel.get().getTitreBook();
        notificationService.sendNouvelEmprunt(proprietaire.getEmail(), principal.getFullName(), titreBook, proprietaire.getFullName());
        notificationService.sendNouvelEmpruntToMyself(principal.getEmail(), proprietaire.getFullName(), titreBook, principal.getFullName());
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
        Livre livre = preteur.getLivre(emprunt.getLivreId()).get();
        Optional<LivreModel> livreModel = this.mongoLivreModelRepository.findById(livre.getLivreModelId());
        String titreBook = livreModel.get().getTitreBook();
        notificationService.sendAcceptation(emprunteur.getEmail(), preteur.getFullName(), titreBook, emprunteur.getFullName());
        notificationService.sendAcceptationToMyself(preteur.getEmail(), emprunteur.getFullName(), titreBook, preteur.getFullName());
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
        Utilisateur preteur = mongoUserRepository.findById(emprunt.getPreteurId()).get();
        Livre livre = preteur.getLivre(emprunt.getLivreId()).get();
        Optional<LivreModel> livreModel = this.mongoLivreModelRepository.findById(emprunt.getLivreModelId());
        String titreBook = livreModel.get().getTitreBook();
        emprunt.setActif(false);
        emprunt.setDateRefus(new Date());
        emprunt.setMotifRefus(refusBean.getRefus());
        empruntRepository.saveEmprunt(emprunt);
        Utilisateur emprunteur = mongoUserRepository.findById(emprunt.getEmprunteurId()).get();
        notificationService.sendRefus(emprunteur.getEmail(), principal.getFullName(), titreBook, refusBean.getRefus(), emprunteur.getFullName());
        notificationService.sendRefusToMyself(preteur.getEmail(), emprunteur.getFullName(), titreBook, refusBean.getRefus(), preteur.getFullName());
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
        Livre livre = preteur.getLivre(emprunt.getLivreId()).get();
        Optional<LivreModel> livreModel = this.mongoLivreModelRepository.findById(livre.getLivreModelId());
        Utilisateur emprunteur = mongoUserRepository.findById(emprunt.getEmprunteurId()).get();
        notificationService.sendLivreEnvoye(preteur.getEmail(), emprunteur.getFullName(), livreModel.get().getTitreBook(), preteur.getFullName());
        notificationService.sendLivreEnvoyeToMyself(principal.getEmail(), preteur.getFullName(), livreModel.get().getTitreBook(), principal.getFullName());

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
        Utilisateur preteur = mongoUserRepository.findById(emprunt.getPreteurId()).get();
        Livre livre = preteur.getLivre(emprunt.getLivreId()).get();
        Optional<LivreModel> livreModel = this.mongoLivreModelRepository.findById(livre.getLivreModelId());
        String titreBook = livreModel.get().getTitreBook();
        notificationService.sendClore(emprunteur.getEmail(), preteur.getFullName(), titreBook, emprunteur.getFullName());
        notificationService.sendCloreToMyself(preteur.getEmail(), titreBook, preteur.getFullName());
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
        Utilisateur preteur = mongoUserRepository.findById(emp.getPreteurId()).get();
        emp.setPreteur(preteur);
        emp.setEmprunteur(mongoUserRepository.findById(emp.getEmprunteurId()).get());
        Livre book = null;
        if (preteur.getLivre(emp.getLivreId()).isPresent()){
            book = preteur.getLivre(emp.getLivreId()).get();
        }
        if(book != null) {
            emp.setLivre(book);
        }
        if(emp.getLivreModelId() != null) {
            Optional<LivreModel> livreModel = this.mongoLivreModelRepository.findById(emp.getLivreModelId());
            if(livreModel.isPresent()) {
                emp.setLivreModel(livreModel.get());
            }
        }

        setCommentuser(emp);
    }

    private boolean isNewPret(List<Emprunt> listeEmp, Utilisateur user) {
        for (Emprunt emp : listeEmp) {
            Optional<Livre> livre = user.getLivre(emp.getLivreId());
            if (livre.isPresent() && livre.get().getStatut().equals(StatutEmprunt.REQUESTED)) {
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