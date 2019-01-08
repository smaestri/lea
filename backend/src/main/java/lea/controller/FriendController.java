package lea.controller;

import lea.commun.Utils;
import lea.dto.AmiBean;
import lea.modele.Categorie;
import lea.modele.Emprunt;
import lea.modele.PendingFriend;
import lea.modele.Utilisateur;
import lea.repository.categorie.CategorieRepository;
import lea.repository.emprunt.EmpruntRepository;
import lea.repository.user.MongoUserRepository;
import lea.repository.user.UserRepository;
import lea.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;


@RestController
public class FriendController extends CommonController {

    @Autowired
    private NotificationService mailService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MongoUserRepository mongoUserRepository;

    @Autowired
    private EmpruntRepository empruntRepository;

    @Autowired
    private CategorieRepository categorieRepository;

    @Autowired
    private NotificationService notificationService;


    @RequestMapping(value = "/api/myFriends", method = RequestMethod.GET)
    public List<Utilisateur> myFriends() {
        Utilisateur user = getPrincipal();
        Utilisateur one = mongoUserRepository.findById(user.getId()).get();

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
        Utilisateur one = mongoUserRepository.findById(user.getId()).get();
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
    public String addUser(@RequestBody AmiBean amiBean) {
        Utilisateur userPrincipal = getPrincipal();
        Utilisateur one = mongoUserRepository.findById(userPrincipal.getId()).get();

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
    public String accepterAmi(@PathVariable("friendId") String idFriend){
        Utilisateur userConnected = getPrincipal();
        Utilisateur userFriend = mongoUserRepository.findById(idFriend).get();


        addRealFriendAndDeletePending(userConnected, userFriend);
        addRealFriendAndDeletePending(userFriend, userConnected);

        notificationService.sendAmiAccepted(userFriend.getEmail(), userConnected.getFullName(), userFriend.getFullName());

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
    public String deletePendingFriend(@PathVariable("friendId") String friendId) {
        Utilisateur userConnected = getPrincipal();
        userRepository.deletePendingFriend(userConnected, friendId);
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

    private String addPendingFriend(Utilisateur source, String emailFriend){
        PendingFriend pf = new PendingFriend();
        pf.setDateDemande(new Date());
        pf.setEmail(emailFriend);
        if (StringUtils.hasText(emailFriend) && Utils.checkEmail(emailFriend) && !emailFriend.equals(source.getEmail())) {
            userRepository.addPendingFriend(source, pf);
            notificationService.sendNewAmi(emailFriend, source.getFullName(), "");

        } else {
            return "KO email incorrect";
        }
        return "OK";
    }

    // TODO to merge see EmpruntController
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
