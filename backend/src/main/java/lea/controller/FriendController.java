package lea.controller;

import lea.dto.AmiBean;
import lea.modele.Categorie;
import lea.modele.Emprunt;
import lea.modele.PendingFriend;
import lea.modele.Utilisateur;
import lea.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import javax.mail.MessagingException;
import java.io.UnsupportedEncodingException;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
public class FriendController extends CommonController {

    @Autowired
    private NotificationService mailService;

    // My friends: GET
    @RequestMapping(value = "/api/myFriends", method = RequestMethod.GET)
    public List<Utilisateur>  myFriends() {
        Utilisateur user = getPrincipal();
        Utilisateur one = userRepository.findOne(user.getId());

        //set immage
        List<Utilisateur> users = userRepository.findFriends(one.getListFriendsId());

        for(Utilisateur userDetail : users){
            userDetail.setAvatar("/webjars/app-react/1.0.0/img/user.png");
        }
        return users;
    }

    // My pending friends: GET the emails added but not responded
    @RequestMapping(value = "/api/myPendingFriends", method = RequestMethod.GET)
    public List<PendingFriend> myPendingFriends() {
        Utilisateur user =getPrincipal();
        //need to reload
        Utilisateur one = userRepository.findOne(user.getId());
        return one.getListPendingFriends();
    }

    // My requested friends: GET : show the users whoses have added the current connected one
    @RequestMapping(value = "/api/myRequestedFriends", method = RequestMethod.GET)
    public List<Utilisateur> myRequestedFriends() {
        Utilisateur user = getPrincipal();
        List<Utilisateur> requestedFriends = userRepository.findRequestedFriends(user.getEmail());
        return requestedFriends;
    }

    // My requested friends: GET : show the users whoses have added the current connected one
    @RequestMapping(value = "/api/getCategories", method = RequestMethod.GET)
    public List<Categorie> getCategories() {
        List<Categorie> all = categorieRepository.findAll();
        return all;
    }

    // Creer un ami : POST
    @RequestMapping(value = "/api/ami/new", method = RequestMethod.POST)
    public void addUser(@RequestBody AmiBean amiBean) throws UnsupportedEncodingException, MessagingException {
        Utilisateur userPrincipal = getPrincipal();
        Utilisateur one = userRepository.findOne(userPrincipal.getId());

        //check if i am requested by the friend i wan to add
        List<Utilisateur> requestedFriends = userRepository.findRequestedFriends(userPrincipal.getEmail());
        if(requestedFriends != null && requestedFriends.size() > 0){
            for(Utilisateur user : requestedFriends){
                for(PendingFriend pf : user.getListPendingFriends()){
                    if(pf.getEmail().equals(one.getEmail())){
                        addRealFriendAndDeletePending(one, user);
                        addRealFriendAndDeletePending(user, one);
                    }
                }
            }
        }
        else{
            PendingFriend pf = new PendingFriend();
            pf.setEmail(amiBean.getEmail1());
            pf.setDateDemande(new Date());
            userRepository.addPendingFriend(userPrincipal, pf);
        }

    }

    @RequestMapping(value = "/api/accepterAmi/{friendId}", method = RequestMethod.POST)
    public String accepterAmi(@PathVariable("friendId") String idFriend) {
        Utilisateur userConnected = getPrincipal();
        Utilisateur userFriend = userRepository.findOne(idFriend);

        addRealFriendAndDeletePending(userConnected, userFriend);
        addRealFriendAndDeletePending(userFriend, userConnected);

        return "OK";
    }

    // Supprimer friend : DELETE
    @RequestMapping(value = "/api/friend/{friendId}", method = RequestMethod.DELETE)
    public String deleteFriend(@PathVariable("friendId") String friendId) throws Exception {
        Utilisateur userConnected = getPrincipal();

        //Check if no current loan with this user before deleting
        List<Emprunt> emprunts = empruntRepository.findEmprunts(friendId, true);
        boolean found = isUserLender(emprunts, userConnected.getId() );
        if(!found) {
            List<Emprunt> prets = empruntRepository.findPrets(friendId, true);
            found = isUserLoaner(prets, userConnected.getId());
            if (!found) {
                userRepository.deleteFriend(userConnected, friendId);
                return "1";
            }
        }
        return "0";
    }

    // Supprimer pending friend : DELETE
    @RequestMapping(value = "/api/pendingFriend/{friendId}", method = RequestMethod.DELETE)
    public String deletePendingFriend(@PathVariable("friendId") String friendId) throws Exception {
        Utilisateur userConnected = getPrincipal();
        userRepository.deletePendingFriend(userConnected, friendId);
        return "1";
    }

    private boolean isUserLender(List<Emprunt> emprunts, String idUser){
        for(Emprunt emp : emprunts){
            if(emp.getPreteurId().equals(idUser)){
                return true;
            }
        }
        return false;
    }

    private boolean isUserLoaner(List<Emprunt> emprunts, String idUser){
        for(Emprunt emp : emprunts){
            if(emp.getEmprunteurId().equals(idUser)){
                return true;
            }
        }
        return false;
    }

    private void addRealFriendAndDeletePending(Utilisateur user, Utilisateur friend) {
        user.getListFriendsId().add(friend.getId());
        userRepository.saveUser(user);

        // find my pending friend from this user
        PendingFriend pf = userRepository.findPendingFriend(user, friend.getEmail());
        if(pf != null){
            userRepository.deletePendingFriend(user, pf.getId());
        }
    }

    private String addPendingFriend(Utilisateur source, String emailFriend){
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
