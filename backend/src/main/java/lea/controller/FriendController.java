package lea.controller;

import lea.dto.AmiBean;
import lea.modele.Categorie;
import lea.modele.Emprunt;
import lea.modele.PendingFriend;
import lea.modele.Utilisateur;
import lea.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import javax.mail.MessagingException;
import java.io.UnsupportedEncodingException;
import java.util.Date;
import java.util.List;


@RestController
public class FriendController extends CommonController {

    @Autowired
    private NotificationService mailService;

    @RequestMapping(value = "/api/myFriends", method = RequestMethod.GET)
    public List<Utilisateur> myFriends() {
        Utilisateur user = getPrincipal();
        Utilisateur one = userRepository.findOne(user.getId());

        List<Utilisateur> users = userRepository.findFriends(one.getListFriendsId());

        for (Utilisateur userDetail : users) {
            userDetail.setAvatar("/webjars/app-react/1.0.0/img/user.png");
        }
        return users;
    }

    @RequestMapping(value = "/api/myPendingFriends", method = RequestMethod.GET)
    public List<PendingFriend> myPendingFriends() {
        Utilisateur user = getPrincipal();
        //need to reload
        Utilisateur one = userRepository.findOne(user.getId());
        return one.getListPendingFriends();
    }

    @RequestMapping(value = "/api/myRequestedFriends", method = RequestMethod.GET)
    public List<Utilisateur> myRequestedFriends() {
        Utilisateur user = getPrincipal();
        List<Utilisateur> requestedFriends = userRepository.findRequestedFriends(user.getEmail());
        return requestedFriends;
    }

    @RequestMapping(value = "/api/getCategories", method = RequestMethod.GET)
    public List<Categorie> getCategories() {
        List<Categorie> all = categorieRepository.findAll();
        return all;
    }

    @RequestMapping(value = "/api/ami/new", method = RequestMethod.POST)
    public String addUser(@RequestBody AmiBean amiBean) throws UnsupportedEncodingException, MessagingException {
        Utilisateur userPrincipal = getPrincipal();
        Utilisateur one = userRepository.findOne(userPrincipal.getId());

        List<Utilisateur> requestedFriends = userRepository.findRequestedFriends(userPrincipal.getEmail());
        if (requestedFriends != null && requestedFriends.size() > 0) {
            for (Utilisateur user : requestedFriends) {
                for (PendingFriend pf : user.getListPendingFriends()) {
                    if (pf.getEmail().equals(one.getEmail())) {
                        addRealFriendAndDeletePending(one, user);
                        addRealFriendAndDeletePending(user, one);
                        return "OK";
                    }
                }
            }
        } else {
            return this.addPendingFriend(one, amiBean.getEmail1());
        }
        return "KO";
    }

    @RequestMapping(value = "/api/accepterAmi/{friendId}", method = RequestMethod.POST)
    public String accepterAmi(@PathVariable("friendId") String idFriend) throws InterruptedException {
        Utilisateur userConnected = getPrincipal();
        Utilisateur userFriend = userRepository.findOne(idFriend);

        addRealFriendAndDeletePending(userConnected, userFriend);
        addRealFriendAndDeletePending(userFriend, userConnected);

        this.mailService.sendNotificaition(userFriend.getEmail(), "Livres entre amis - Vous avez un nouvel ami!", userConnected.getEmail() + " a accecpté votre demande d'amis! Vous pouvez donc échanger des livres avec lui/elle! A bientôt sur Livres entre amis!");

        return "OK";
    }

    @RequestMapping(value = "/api/friend/{friendId}", method = RequestMethod.DELETE)
    public String deleteFriend(@PathVariable("friendId") String friendId) throws Exception {
        Utilisateur userConnected = getPrincipal();

        //Check if no current loan with this user before deleting
        List<Emprunt> emprunts = empruntRepository.findEmprunts(friendId, true);
        boolean found = isUserLender(emprunts, userConnected.getId());
        if (!found) {
            List<Emprunt> prets = empruntRepository.findPrets(friendId, true);
            found = isUserLoaner(prets, userConnected.getId());
            if (!found) {
                userRepository.deleteFriend(userConnected.getId(), friendId);
                return "1";
            }
        }
        return "0";
    }

    @RequestMapping(value = "/api/pendingFriend/{friendId}", method = RequestMethod.DELETE)
    public String deletePendingFriend(@PathVariable("friendId") String friendId) throws Exception {
        Utilisateur userConnected = getPrincipal();
        userRepository.deletePendingFriend(userConnected, friendId);
        Utilisateur userFriend = userRepository.findOne(userConnected.getId());
        return "1";
    }

    private boolean isUserLender(List<Emprunt> emprunts, String idUser) {
        for (Emprunt emp : emprunts) {
            if (emp.getPreteurId().equals(idUser)) {
                return true;
            }
        }
        return false;
    }

    private boolean isUserLoaner(List<Emprunt> emprunts, String idUser) {
        for (Emprunt emp : emprunts) {
            if (emp.getEmprunteurId().equals(idUser)) {
                return true;
            }
        }
        return false;
    }

    private String addPendingFriend(Utilisateur source, String emailFriend) {
        PendingFriend pf = new PendingFriend();
        pf.setDateDemande(new Date());
        pf.setEmail(emailFriend);
        if (StringUtils.hasText(emailFriend) && LoginController.checkEmail(emailFriend) && !emailFriend.equals(source.getEmail())) {
            userRepository.addPendingFriend(source, pf);
            String objet = "Livres entre Amis - Nouvelle demande d'ami";
            String contenu = source.getFullName() + " souhaite vous ajouter en tant qu'ami afin d'échanger des livres. Connectez-vous ou inscrivez vous sur livresentreamis.com afin de rentrer dans la communatuté!";
            try {
                this.mailService.sendNotificaition(emailFriend, objet, contenu);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        } else {
            return "KO email incorrect";
        }
        return "OK";
    }

}
