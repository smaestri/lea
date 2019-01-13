package lea.controller;

import lea.configuration.security.CustomUserDetailsService;
import lea.dto.UserBean;
import lea.modele.Livre;
import lea.modele.LivreModel;
import lea.modele.Utilisateur;
import lea.repository.emprunt.EmpruntRepository;
import lea.repository.livremodel.MongoLivreModelRepository;
import lea.repository.user.MongoUserRepository;
import lea.repository.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
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
    private MongoUserRepository mongoUserRepository;


    @Autowired
    private MongoLivreModelRepository mongoLivreModelRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    //Detail d'un utilisateur ; ses livres et ceux de ses amis
    @RequestMapping(value = "/api/users/{userId}", method = RequestMethod.GET)
    public Utilisateur userDetail(@PathVariable("userId") String userDetail) throws ServletException, IOException {
        Utilisateur userConnected = getPrincipal();
        Utilisateur friend = mongoUserRepository.findById(userDetail).get();
        List<Livre> listeLivre = friend.getLivres();
        if (!listeLivre.isEmpty()) {
            for (Livre livre : listeLivre) {
                LivreModel livreModel = this.mongoLivreModelRepository.findById(livre.getLivreModelId()).get();
                livre.setLivreModel(livreModel);
                livre.setUserId(friend.getId());
                livre.setPreteur(friend.getFullName());
                livre.setMailPreteur(friend.getEmail());
                LivreController.setBookImage(livreModel);
            }
        }

        //Check book of friends of friend
        List<Utilisateur> subFriends = userRepository.findFriends(friend.getListFriendsId());

        List<Utilisateur> userFriends = new ArrayList<Utilisateur>();
        for (Utilisateur subFriend : subFriends) {
            if (!subFriend.getId().equals(userConnected.getId())) {
                userFriends.add(subFriend);
                List<Livre> subFriendBooks = subFriend.getLivres();
                for (Livre livre : subFriendBooks) {
                    LivreModel livreModel = this.mongoLivreModelRepository.findById(livre.getLivreModelId()).get();
                    livre.setLivreModel(livreModel);
                    livre.setUserId(subFriend.getId());
                    LivreController.setBookImage(livreModel);
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
        Utilisateur user = mongoUserRepository.findById(userId).get();
        return user;
    }

    @RequestMapping(value = "/api/account", method = RequestMethod.GET)
    public Utilisateur account() throws ServletException, IOException {
        Utilisateur userConnected = getPrincipal();
        Utilisateur user = mongoUserRepository.findById(userConnected.getId()).get();
        return user;
    }

    @RequestMapping(value = "/api/updateUSer", method = RequestMethod.POST)
    public String updateUSer(@RequestBody UserBean user) {
        Utilisateur userConnected = getPrincipal();
        Utilisateur userDetail = mongoUserRepository.findById(userConnected.getId()).get();
        userDetail.setLastName(user.getLastName());
        userDetail.setFirstName(user.getFirstName());
        userDetail.setPassword(passwordEncoder.encode(user.getPassword()));
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

    @RequestMapping("/succeslogin")
    public CustomUserDetailsService.UserPrincipal success(Authentication authentication) {

        CustomUserDetailsService.UserPrincipal userDetails = (CustomUserDetailsService.UserPrincipal) authentication.getPrincipal();
        return userDetails;

    }
}
