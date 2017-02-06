package lea.controller;

import lea.dto.AmiBean;
import lea.modele.Utilisateur;
import lea.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import javax.mail.MessagingException;
import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
public class FriendController extends CommonController {

    @Autowired
    private NotificationService mailService;

    // My friends: GET
    @RequestMapping(value = "/myFriends", method = RequestMethod.GET)
    public List<Utilisateur>  myFriends() {
        Map<String, List<Utilisateur>> map = new HashMap<String, List<Utilisateur>>();
        Utilisateur user = getPrincipal();
        Utilisateur one = userRepository.findOne(user.getId());
        return userRepository.findFriends(one.getListFriendsId());
    }

    // My pending friends: GET the emails added but not responded
    @RequestMapping(value = "/myPendingFriends", method = RequestMethod.GET)
    public List<String> myPendingFriends() {
        Utilisateur user =getPrincipal();
        //need to reload
        Utilisateur one = userRepository.findOne(user.getId());
        return one.getListPendingFriends();
    }

    // My requested friends: GET : show the users whoses have added the current connected one
    @RequestMapping(value = "/myRequestedFriends", method = RequestMethod.GET)
    public List<Utilisateur> myRequestedFriends() {
        Utilisateur user = getPrincipal();
        List<Utilisateur> requestedFriends = userRepository.findRequestedFriends(user.getEmail());
        return requestedFriends;
    }

    // Creer un ami : POST
    @RequestMapping(value = "/ami/new", method = RequestMethod.POST)
    public String addUser(@RequestBody AmiBean amiBean) throws UnsupportedEncodingException, MessagingException {

        Utilisateur userPrincipal = getPrincipal();
        Utilisateur one = userRepository.findOne(userPrincipal.getId());
        if (one == null) {
            return "redirect:/";
        }
        String emailEmetteur = one.getEmail();

        String emailFriend = amiBean.getEmail1();
        if (StringUtils.hasText(emailFriend) && LoginController.checkEmail(emailFriend) && !emailFriend.equals(emailEmetteur)) {
            userRepository.addPendingFriend(one, emailFriend);
            String objet = "Livres entre Amis - Nouvelle demande d'ami";
            String contenu = emailEmetteur + " souhaite vous ajouter en tant qu'ami afin d'échanger des livres. Connectez-vous ou inscrivez vous sur livresentreamis.com afin de rentrer dans la communatuté!";
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

    @RequestMapping(value = "/accepterAmi/{friendId}", method = RequestMethod.POST)
    public String accepterAmi(@PathVariable("friendId") String idFriend) {
        Utilisateur userConnected = getPrincipal();
        Utilisateur userFriend = userRepository.findOne(idFriend);

        addRealFriendAndDeletePending(userConnected, userFriend);
        addRealFriendAndDeletePending(userFriend, userConnected);

        return "OK";
    }

    private void addRealFriendAndDeletePending(Utilisateur user, Utilisateur friend) {
        user.getListFriendsId().add(friend.getId());
        userRepository.saveUser(user);
        userRepository.deletePendingFriend(user, friend.getEmail());
    }
}
