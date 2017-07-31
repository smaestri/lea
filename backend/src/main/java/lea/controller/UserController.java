package lea.controller;

import lea.dto.UserBean;
import lea.modele.Emprunt;
import lea.modele.Livre;
import lea.modele.PendingFriend;
import lea.modele.Utilisateur;
import lea.repository.emprunt.EmpruntRepository;
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
    private PasswordEncoder passwordEncoder;

    //Detail d'un utilisateur ; ses livres et ceux de ses amis
    @RequestMapping(value = "/api/users/{userId}", method = RequestMethod.GET)
    public List<Livre> userDetail(@PathVariable("userId") String userDetail) throws ServletException, IOException {
        Utilisateur userConnected = getPrincipal();
        Utilisateur friend = userRepository.findOne(userDetail);

        // Check if user friend of mine
        Utilisateur user = userRepository.findOne(userConnected.getId());
        // List<Utilisateur> friends = userRepository.findFriends(user.getListFriendsId());
        boolean found = isMyfriend(user.getListFriendsId(), friend.getId());


        // in my pending friends?
        //si pending friend
        boolean isPending = false;
        if(!found){
             isPending = isInPendingFriend(user, friend.getEmail());
        }

        List<Livre> result = new ArrayList<Livre>();
        List<Livre> listeLivre = friend.getLivres();

        // set image
        if (!listeLivre.isEmpty()) {
            for (Livre livre : listeLivre) {
                livre.setUserId(friend.getId());
                livre.setPreteur(friend.getFullName());
                livre.setMailPreteur(friend.getEmail());
                livre.setEmpruntable(found);
                livre.setPending(isPending);
                LivreController.setBookImage(livre);
            }
        }

        result.addAll(listeLivre);

        //Check book of friends of friend
        List<Utilisateur> subFriends = userRepository.findFriends(friend.getListFriendsId());
        for (Utilisateur subFriend: subFriends) {
            boolean subFriendIsMyFriend = isMyfriend(user.getListFriendsId(), subFriend.getId());

            if (!subFriend.getId().equals(userConnected.getId())) {
                isPending = isInPendingFriend(user, subFriend.getEmail());
                List<Livre> listeLivre2 = subFriend.getLivres();
                for (Livre livre : listeLivre2) {
                    livre.setUserId(subFriend.getId());
                    LivreController.setBookImage(livre);
                    livre.setPreteur(subFriend.getFullName());
                    livre.setIntermediaireid(friend.getId());
                    livre.setMailPreteur(subFriend.getEmail());
                    livre.setEmpruntable(subFriendIsMyFriend);
                    livre.setPending(isPending);
                }
                result.addAll(listeLivre2);
            }
        }
        return result;
    }

    // account
    @RequestMapping(value = "/api/userInfo/{userId}", method = RequestMethod.GET)
    public Utilisateur getUserInfo(@PathVariable("userId") String userId) throws ServletException, IOException {
        Utilisateur user = userRepository.findOne(userId);
        return user;
    }

    @RequestMapping(value = "/api/historized-loans", method = RequestMethod.GET)
    public List<Emprunt> empruntsHistories() throws ServletException, IOException {
        Utilisateur userConnected = getPrincipal();
        List<Emprunt> emprunts = empruntRepository.findEmprunts(userConnected.getId(), false);

        for (Emprunt emp : emprunts) {
            setEmpruntOjects(emp);
        }
        return emprunts;
    }

    @RequestMapping(value = "/api/historized-lendings", method = RequestMethod.GET)
    public List<Emprunt> pretHistories() throws ServletException, IOException {
        Utilisateur userConnected = getPrincipal();
        List<Emprunt> prets = empruntRepository.findPrets(userConnected.getId(), false);

        for (Emprunt pret : prets) {
            setEmpruntOjects(pret);
        }

        return prets;
    }

    // account
    @RequestMapping(value = "/api/account", method = RequestMethod.GET)
    public Utilisateur account() throws ServletException, IOException {
        Utilisateur userConnected = getPrincipal();
        Utilisateur user = userRepository.findOne(userConnected.getId());
        return user;
    }

    @RequestMapping(value = "/api/saveEditUser", method = RequestMethod.POST)
    public String saveUser(@RequestBody UserBean user) throws ServletException, IOException {
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
    public String isAuthenticated(){
        Utilisateur userSpring = getPrincipal();
        if(userSpring != null){
            return userSpring.getId();
        }
        return "0";
    }

    private void setEmpruntOjects(Emprunt emp){
        emp.setPreteur(userRepository.findOne(emp.getPreteurId()));
        emp.setEmprunteur(userRepository.findOne(emp.getEmprunteurId()));
        Livre book = userRepository.findBook(emp.getLivreId());
        LivreController.setBookImage(book);
        emp.setLivre(book);
    }

    private boolean isInPendingFriend(Utilisateur user, String mail){

        List<PendingFriend> listPendingFriends = user.getListPendingFriends();
        for(PendingFriend pf : listPendingFriends){
            if(pf.getEmail().equals(mail)){
                return true;
            }
        }
        return false;

    }

    private boolean isMyfriend(List<String> friends, String friendId){
        boolean isFriend = false;
        for(String idfriend : friends){

            if(idfriend.equals(friendId)){
                isFriend = true;
                break;
            }

            // check sub friend of this user
           /*
            List<Utilisateur> subFriends = userRepository.findFriends(us.getListFriendsId());
            for(Utilisateur sub : subFriends){
                // check if friend of friend is my friend
               for(String myfriend : userConnected.getListFriendsId()){
                   if (myfriend == sub.getId()){
                       isFriend = true;
                       break;
                   }
               }



            }*/


        }
        return isFriend;
    }


}
