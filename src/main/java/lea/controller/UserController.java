package lea.controller;

import lea.dto.UserBean;
import lea.modele.Emprunt;
import lea.modele.Livre;
import lea.modele.Utilisateur;
import lea.repository.emprunt.EmpruntRepository;
import lea.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.*;

import javax.servlet.ServletException;
import java.io.IOException;
import java.util.List;

@RestController
public class UserController extends CommonController {

    @Autowired
    private EmpruntRepository empruntRepository;

    //Detail d'un utilisateur ; ses livres et ceux de ses amis
    @RequestMapping(value = "/users/{userId}", method = RequestMethod.GET)
    public Utilisateur userDetail(@PathVariable("userId") String userDetail) throws ServletException, IOException {
        Utilisateur userConnected = getPrincipal();
        Utilisateur friend = userRepository.findOne(userDetail);

        List<Livre> listeLivre = friend.getLivres();

        // set image
        if (!listeLivre.isEmpty()) {
            for (Livre livre : listeLivre) {
                livre.setUserId(friend.getId());
                LivreController.setBookImage(livre);
            }
        }

        //Check book of friends of friend
        List<Utilisateur> subFriends = userRepository.findFriends(friend.getListFriendsId());
        for (Utilisateur subFriend: subFriends) {
            if (!subFriend.getId().equals(userConnected.getId())) {
                List<Livre> listeLivre2 = subFriend.getLivres();
                for (Livre livre : listeLivre2) {
                    livre.setUserId(subFriend.getId());
                    LivreController.setBookImage(livre);
                }
                friend.getUserFriends().add(subFriend);
            }
        }
        return friend;
    }

    @RequestMapping(value = "/historized-loans", method = RequestMethod.GET)
    public List<Emprunt> empruntsHistories() throws ServletException, IOException {
        Utilisateur userConnected = getPrincipal();
        List<Emprunt> emprunts = empruntRepository.findEmprunts(userConnected.getId(), false);

        for (Emprunt emp : emprunts) {
            setEmpruntOjects(emp);
        }
        return emprunts;
    }

    @RequestMapping(value = "/historized-lendings", method = RequestMethod.GET)
    public List<Emprunt> pretHistories() throws ServletException, IOException {
        Utilisateur userConnected = getPrincipal();
        List<Emprunt> prets = empruntRepository.findPrets(userConnected.getId(), false);

        for (Emprunt pret : prets) {
            setEmpruntOjects(pret);
        }

        return prets;
    }

    // account
    @RequestMapping(value = "/account", method = RequestMethod.GET)
    public Utilisateur account() throws ServletException, IOException {
        Utilisateur userConnected = getPrincipal();
        Utilisateur user = userRepository.findOne(userConnected.getId());
        return user;
    }

    @RequestMapping(value = "/saveEditUser", method = RequestMethod.POST)
    public String saveUser(@RequestBody UserBean user) throws ServletException, IOException {
        Utilisateur userConnected = getPrincipal();
        Utilisateur userDetail = userRepository.findOne(userConnected.getId());
        userDetail.setLastName(user.getLastName());
         userDetail.setFirstName(user.getFirstName());
         userDetail.setPassword(user.getPassword());
         userDetail.setConfirmPassword(user.getConfirmPassword());
        userRepository.saveUser(userDetail);
        return "1";
    }

    private void setEmpruntOjects(Emprunt emp){
        emp.setPreteur(userRepository.findOne(emp.getPreteurId()));
        emp.setEmprunteur(userRepository.findOne(emp.getEmprunteurId()));
        Livre book = userRepository.findBook(emp.getLivreId());
        LivreController.setBookImage(book);
        emp.setLivre(book);
    }

}
