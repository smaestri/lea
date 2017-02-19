package lea.controller;

import lea.dto.UserBean;
import lea.modele.Emprunt;
import lea.modele.Livre;
import lea.modele.Utilisateur;
import lea.repository.emprunt.EmpruntRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.ServletException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
public class UserController extends CommonController {

    @Autowired
    private EmpruntRepository empruntRepository;

    //Detail d'un utilisateur ; ses livres et ceux de ses amis
    @RequestMapping(value = "/api/users/{userId}", method = RequestMethod.GET)
    public List<Livre> userDetail(@PathVariable("userId") String userDetail) throws ServletException, IOException {
        Utilisateur userConnected = getPrincipal();
        Utilisateur friend = userRepository.findOne(userDetail);

        List<Livre> result = new ArrayList<Livre>();
        List<Livre> listeLivre = friend.getLivres();

        // set image
        if (!listeLivre.isEmpty()) {
            for (Livre livre : listeLivre) {
                livre.setUserId(friend.getId());
                livre.setPreteur(friend.getFullName());
                livre.setMailPreteur(friend.getEmail());
                livre.setEmpruntable(true);
                LivreController.setBookImage(livre);
            }
        }

        result.addAll(listeLivre);

        //Check book of friends of friend
        List<Utilisateur> subFriends = userRepository.findFriends(friend.getListFriendsId());
        for (Utilisateur subFriend: subFriends) {
            if (!subFriend.getId().equals(userConnected.getId())) {
                List<Livre> listeLivre2 = subFriend.getLivres();
                for (Livre livre : listeLivre2) {
                    livre.setUserId(subFriend.getId());
                    LivreController.setBookImage(livre);
                    livre.setPreteur(subFriend.getFullName());
                    livre.setIntermediaireid(friend.getId());
                    livre.setMailPreteur(subFriend.getEmail());
                    livre.setEmpruntable(true);
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
