package lea.controller;

import lea.commun.StatutEmprunt;
import lea.dto.EmpruntBean;
import lea.modele.Commentaire;
import lea.modele.Emprunt;
import lea.modele.Livre;
import lea.modele.Utilisateur;
import lea.repository.commentaire.CommentaireRepository;
import lea.repository.emprunt.EmpruntRepository;
import lea.repository.livre.LivreRepository;
import lea.repository.user.UserRepository;
import lea.service.MailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import javax.mail.MessagingException;
import javax.servlet.ServletException;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.text.ParseException;
import java.util.*;

@Controller
public class EmpruntController extends CommonController {


    @Autowired
    private LivreRepository livreRepository;
    @Autowired
    private CommentaireRepository commentaireRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private EmpruntRepository empruntRepository;
    @Autowired
    //@Qualifier("mockMail")
    @Qualifier("realMail")
    private MailService mailService;


    @RequestMapping(value = "/emprunts", method = RequestMethod.GET)
    public String livresHandler(Model model) throws ServletException, IOException {
        Utilisateur principal = initSearchFormAndPrincipal(model, false);
        List<Emprunt> emprunts = empruntRepository.findEmprunts(principal.getId(), true);
        for (Emprunt emp : emprunts) {
            Livre one = this.livreRepository.findOne(emp.getLivreId());
            LivreController.setBookImage(one);
        }

        model.addAttribute("empruntsCourants", emprunts);
        return ("emprunt/list-emprunt");
    }

    @RequestMapping(value = "/echanges", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public List<Commentaire> getEchanges(Model model, @RequestParam(value = "empruntId", required = false) String empruntId) throws ServletException, IOException {
        Set<String> comments = empruntRepository.getCommentaires(empruntId);
        List<Commentaire> newList = new ArrayList(comments);

        for(String comId : comments){
            Commentaire one = this.commentaireRepository.findOne(comId);
            newList.add(one);
        }

        Collections.sort(newList);
        return newList;
    }

    @RequestMapping(value = "/prets", method = RequestMethod.GET)
    public String livresHandlerPrets(Model model) throws ServletException, IOException {
        Utilisateur principal = initSearchFormAndPrincipal(model, false);
        List<Emprunt> prets = empruntRepository.findPrets(principal.getId(), true);
        setIntermediaire(principal, prets, false);
        for (Emprunt emp : prets) {
            Livre livre = livreRepository.findOne(emp.getLivreId());
            LivreController.setBookImage(livre);
        }
        model.addAttribute("pretsCourants", prets);
        return "emprunt/list-pret";
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

    @RequestMapping(value = "/emprunter/{livreId}", method = RequestMethod.GET)
    @ResponseBody
    public String askEmprunt(@RequestParam(value = "proprietaire", required = false) String proprietaireId) {
        Utilisateur principal = getPrincipal();
        boolean friend = userRepository.isFriend(Integer.valueOf(principal.getId()), Integer.valueOf(proprietaireId));
        Utilisateur proprietaire = userRepository.findOne(proprietaireId);
        return "Veuillez confirmer que vous souhaitez effectuer une demande d'emprunt pour ce livre à votre ami " + proprietaire.getFullName();
    }


    @RequestMapping(value = "/emprunter", method = RequestMethod.POST)
    public String processNewEmpruntForm(EmpruntBean empruntBean) throws ParseException { //@RequestBody EmpruntBean empruntBean
        Utilisateur principal = getPrincipal();
        Utilisateur proprietaire = userRepository.findOne(empruntBean.getIdProprietaire());
        Utilisateur emprunteur = userRepository.findOne(principal.getId());
        Emprunt emprunt = new Emprunt();
        emprunt.setActif(true);
        emprunt.setDateDemande(new Date());
        emprunt.setEmprunteurId(emprunteur.getId());
        emprunt.setPreteurId(proprietaire.getId());

        emprunt.setLivreId(empruntBean.getIdLivre());
        this.empruntRepository.addEmprunt(emprunt);
        if (!StringUtils.isEmpty(empruntBean.getTxtRencontre())) {
            Commentaire comm = new Commentaire();
            comm.setMessage(empruntBean.getTxtRencontre());
            comm.setDateMessage(new Date());
            comm.setEmpruntId(emprunt.getId());
            comm.setUserId(emprunteur.getId());
            this.commentaireRepository.save(comm);
        }
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
            Livre livre = livreRepository.getLivreDetail(Integer.valueOf(empruntBean.getIdLivre()));
            mailService.sendEmail("Livres entre Amis - nouvelle demande d'emprunt de la part de " + emprunteur.getFullName() + txtIntermediaire + " pour le livre '" + livre.getTitreBook() + "'. Connectez-vous au site pour consulter et accepter cet emprunt!", proprietaire.getEmail(), "Nouvelle demande d'emprunt");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        } catch (MessagingException e) {
            // logger.error("erreur" + e);
            e.printStackTrace();
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

        Livre livre = livreRepository.findOne(emprunt.getLivreId());
        livre.setStatut(StatutEmprunt.CURRENT);
        livreRepository.saveLivre(livre);
        emprunt.setActif(true);
        empruntRepository.updateEmprunt(emprunt);
        String emprunteurId = emprunt.getEmprunteurId();
        Utilisateur emprunteur= userRepository.findOne(emprunteurId);
        Utilisateur preteur = userRepository.findOne(emprunt.getPreteurId());
        mailService.sendEmail(preteur.getFullName() + " a accepté votre demande d'emprunt pour le livre " + livre.getTitreBook() + ". Connectez-vous au site pour retourner le livre une fois que vous l'avez lu!", emprunteur.getEmail(), "Le prêteur a accepté votre demande d'emprunt!");
        //return "emprunt/list-pret";
        return "redirect:/prets";
    }

    @RequestMapping(value = "/refuserEmprunt/{empruntId}", method = RequestMethod.POST)
    public String refuserEmprunt(@PathVariable("empruntId") String empruntId, @RequestBody String refus) throws Exception {
        Utilisateur principal = getPrincipal();
        Emprunt emprunt = empruntRepository.findOne(empruntId);
        if (!principal.getId().equals(emprunt.getPreteurId())) {
            throw new Exception("Probleme de securite");
        }
        String livreId = emprunt.getLivreId();
        Livre livre = livreRepository.findOne(livreId);
        livre.setStatut(StatutEmprunt.FREE);
        livreRepository.saveLivre(livre);
        emprunt.setActif(false);
        emprunt.setMotifRefus(refus);
        empruntRepository.updateEmprunt(emprunt);
        Utilisateur emprunteur = userRepository.findOne(emprunt.getEmprunteurId());
        mailService.sendEmail(principal.getFullName() + " a refusé votre demande d'emprunt avec le motif :" + refus + ". Le livre est à nouveau empruntable.", emprunteur.getEmail(), "Refus de la demande d'emprunt");
        //return "emprunt/list-pret";
        return "redirect:/prets";
    }

    @RequestMapping(value = "/envoyerEmprunt/{empruntId}", method = RequestMethod.POST)
    public String sendEmprunt(@PathVariable("empruntId") String empruntId) throws Exception {
        Utilisateur principal = getPrincipal();
        Emprunt emprunt = empruntRepository.findOne(empruntId);
        if (!principal.getId().equals(emprunt.getEmprunteurId())) {
            throw new Exception("Probleme de securite");
        }
        String livreId = emprunt.getLivreId();
        Livre livre = livreRepository.findOne(livreId);
        livre.setStatut(StatutEmprunt.SENT);
        livreRepository.saveLivre(livre);

        emprunt.setActif(true);
        empruntRepository.updateEmprunt(emprunt);
        Utilisateur emprunteur = userRepository.findOne(emprunt.getEmprunteurId());
        Utilisateur preteur = userRepository.findOne(emprunt.getPreteurId());
        mailService.sendEmail(emprunteur.getFullName() + " vous a renvoyé le livre. Vous pouvez donc clore l'emprunt en vous connectant au site! ", preteur.getEmail(), "L'emprunteur vous a renvoyé le livre");
        return "redirect:/prets";
    }

    @RequestMapping(value = "/cloreEmprunt/{empruntId}", method = RequestMethod.POST)
    public String cloreEmprunt(@PathVariable("empruntId") String empruntId) throws Exception {
        Utilisateur principal = getPrincipal();
        Emprunt emprunt = empruntRepository.findOne(empruntId);
        if (!principal.getId().equals(emprunt.getPreteurId())) {
            throw new Exception("Probleme de securite");
        }
        String livreId = emprunt.getLivreId();
        Livre livre = livreRepository.findOne(livreId);
        livre.setStatut(StatutEmprunt.FREE);
        livreRepository.saveLivre(livre);
        emprunt.setActif(false);
        empruntRepository.updateEmprunt(emprunt);
        Utilisateur emprunteur= userRepository.findOne(emprunt.getEmprunteurId());
        mailService.sendEmail("Le preteur a clot l'emprunt. Vous pouvez consulter celui-ci dans votre compte, à la rubrique 'Vos emprunts historiés.'  ", emprunteur.getEmail(), "Le preteur a clos l'emprunt");
        return "redirect:/prets";
    }

    @RequestMapping(value = "/addComment/{empruntId}", method = RequestMethod.POST)
    public String addCommentaire(@PathVariable("empruntId") String empruntId, @RequestBody String message) throws ServletException, IOException {
        Utilisateur principal = getPrincipal();
        Commentaire comm = new Commentaire();
        comm.setUserId(principal.getId());
        comm.setEmpruntId(empruntId);
        comm.setDateMessage(new Date());
        comm.setMessage(message);
        commentaireRepository.save(comm);
        return "redirect:/prets";
    }

}