package lea.controller;

import lea.dto.UserBean;
import lea.modele.Emprunt;
import lea.modele.Livre;
import lea.modele.PendingFriend;
import lea.modele.Utilisateur;
import lea.repository.emprunt.EmpruntRepository;
import lea.repository.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.servlet.ServletException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
public class UserController extends CommonController {

    @Autowired
    private EmpruntRepository empruntRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    //Detail d'un utilisateur ; ses livres et ceux de ses amis
    @RequestMapping(value = "/api/users/{userId}", method = RequestMethod.GET)
    public Utilisateur userDetail(@PathVariable("userId") String userDetail) throws ServletException, IOException {
        Utilisateur userConnected = getPrincipal();
        Utilisateur friend = userRepository.findOne(userDetail);
        this.removeDeletedBooks(friend.getLivres());
        List<Emprunt> currentEmprunts = empruntRepository.findEmprunts(userConnected.getId(), true);
        List<Livre> listeLivre = friend.getLivres();
        if (!listeLivre.isEmpty()) {
            for (Livre livre : listeLivre) {
                livre.setUserId(friend.getId());
                livre.setPreteur(friend.getFullName());
                livre.setMailPreteur(friend.getEmail());
                LivreController.setBookImage(livre);
            }
        }

        //Check book of friends of friend
        List<Utilisateur> subFriends = userRepository.findFriends(friend.getListFriendsId());

        List<Utilisateur> userFriends = new ArrayList<Utilisateur>();
        for (Utilisateur subFriend : subFriends) {
            if (!subFriend.getId().equals(userConnected.getId())) {
                userFriends.add(subFriend);
                List<Livre> subFriendBooks = subFriend.getLivres();
                this.removeDeletedBooks(subFriendBooks);
                for (Livre livre : subFriendBooks) {
                    livre.setUserId(subFriend.getId());
                    LivreController.setBookImage(livre);
                    livre.setPreteur(subFriend.getFullName());
                    livre.setIntermediaireid(friend.getId());
                    livre.setMailPreteur(subFriend.getEmail());
                }
            }
        }
        friend.setUserFriends(userFriends);
        return friend;
    }

    @RequestMapping(value = "/api/userInfo/{userId}", method = RequestMethod.GET)
    public Utilisateur getUserInfo(@PathVariable("userId") String userId) throws ServletException, IOException {
        Utilisateur user = userRepository.findOne(userId);
        removeDeletedBooks(user.getLivres());
        return user;
    }

    @RequestMapping(value = "/api/account", method = RequestMethod.GET)
    public Utilisateur account() throws ServletException, IOException {
        Utilisateur userConnected = getPrincipal();
        Utilisateur user = userRepository.findOne(userConnected.getId());
        return user;
    }

    @RequestMapping(value = "/api/saveEditUser", method = RequestMethod.POST)
    public String saveUser(@RequestBody UserBean user) throws ServletException, IOException {
        if (user.getFirstName().length() < 3) {
            return "firstNameLength";
        }

        if (user.getLastName().length() < 3) {
            return "lastNameLength";
        }

        if (user.getPassword().length() < 6) {
            return "passwordLength";
        }
        if (!user.getPassword().equals(user.getConfirmPassword())) {
            return "passwordNotMatch";
        }
        Utilisateur userConnected = getPrincipal();
        Utilisateur userDetail = userRepository.findOne(userConnected.getId());
        userDetail.setLastName(user.getLastName());
        userDetail.setFirstName(user.getFirstName());
        userDetail.setPassword(passwordEncoder.encode(user.getPassword()));
        // userDetail.setConfirmPassword(passwordEncoder.encode(user.getConfirmPassword()));
        userRepository.saveUser(userDetail);
        return "1";
    }


    @RequestMapping("/api/isAuthenticated")
    public String isAuthenticated() {
        Utilisateur userSpring = getPrincipal();
        if (userSpring != null) {
            return userSpring.getId();
        }
        return "0";
    }
}
