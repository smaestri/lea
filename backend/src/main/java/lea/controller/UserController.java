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
    public Utilisateur userDetail(@PathVariable("userId") String userDetail) throws ServletException, IOException {
        Utilisateur userConnected = getPrincipal();
        Utilisateur friend = userRepository.findOne(userDetail);

         this.removeDeletedBooks(friend.getLivres());

        // Check if user friend of mine
        Utilisateur user = userRepository.findOne(userConnected.getId());
        boolean found = isMyfriend(user.getListFriendsId(), friend.getId());
        boolean isPending = false;
        if(!found){
             isPending = isInPendingFriend(user, friend.getEmail());
        }

        List<Livre> listeLivre = friend.getLivres();
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

        //Check book of friends of friend
        List<Utilisateur> subFriends = userRepository.findFriends(friend.getListFriendsId());

        List<Utilisateur> userFriends = new ArrayList<Utilisateur>();
        for (Utilisateur subFriend: subFriends) {
            if (!subFriend.getId().equals(userConnected.getId())) {
                userFriends.add(subFriend);
                // to know if subfriend has already been added as friend
                isPending = isInPendingFriend(user, subFriend.getEmail());
                List<Livre> subFriendBooks = subFriend.getLivres();
                this.removeDeletedBooks(subFriendBooks);
                boolean subFriendIsMyFriend = isMyfriend(user.getListFriendsId(), subFriend.getId());
                for (Livre livre : subFriendBooks) {
                    livre.setUserId(subFriend.getId());
                    LivreController.setBookImage(livre);
                    livre.setPreteur(subFriend.getFullName());
                    livre.setIntermediaireid(friend.getId());
                    livre.setMailPreteur(subFriend.getEmail());
                    livre.setEmpruntable(subFriendIsMyFriend);
                    livre.setPending(isPending);
                }
            }
        }
        friend.setUserFriends(userFriends);
        return friend;
    }


    // account
    @RequestMapping(value = "/api/userInfo/{userId}", method = RequestMethod.GET)
    public Utilisateur getUserInfo(@PathVariable("userId") String userId) throws ServletException, IOException {
        Utilisateur user = userRepository.findOne(userId);
        removeDeletedBooks(user.getLivres());
        return user;
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

        if(user.getFirstName().length() < 3){
            return "firstNameLength";
        }

        if(user.getLastName().length() < 3){
            return "lastNameLength";
        }

        if(user.getPassword().length() < 6){
            return "passwordLength";
        }
        if(!user.getPassword().equals(user.getConfirmPassword())){
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
    public String isAuthenticated(){
        Utilisateur userSpring = getPrincipal();
        if(userSpring != null){
            return userSpring.getId();
        }
        return "0";
    }

    // reset pwd
    // @RequestMapping(value = "/user/resetPassword", method = RequestMethod.POST)
    // @ResponseBody
    // public GenericResponse resetPassword(HttpServletRequest request, @RequestParam("email") String userEmail) {
    // User user = userService.findUserByEmail(userEmail);
    // if (user == null) {
    // throw new UserNotFoundException();
    // }
    // String token = UUID.randomUUID().toString();
    // userService.createPasswordResetTokenForUser(user, token);
    // mailSender.send(constructResetTokenEmail(getAppUrl(request), 
    // request.getLocale(), token, user));
    // return new GenericResponse(
    // messages.getMessage("message.resetPasswordEmail", null, 
    // request.getLocale()));
    // }


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
