package lea.controller;

import lea.modele.Emprunt;
import lea.modele.Livre;
import lea.modele.Utilisateur;
import lea.repository.emprunt.EmpruntRepository;
import lea.service.MailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.ServletException;
import java.io.IOException;
import java.util.List;

@RestController
public class UserController extends CommonController {

    @Autowired
    private EmpruntRepository empruntRepository;

    @Autowired
    @Qualifier("mockMail")
    //@Qualifier("realMail")
    private MailService mailService;

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
                //LivreController.setBookImage(livre);
            }
        }

        //Check book of friends of friend
        List<Utilisateur> subFriends = userRepository.findFriends(friend.getListFriendsId());
        for (Utilisateur subFriend: subFriends) {
            if (!subFriend.getId().equals(userConnected.getId())) {
                List<Livre> listeLivre2 = subFriend.getLivres();
                for (Livre livre : listeLivre2) {
                    livre.setUserId(subFriend.getId());
                    //LivreController.setBookImage(livre);
                }
                friend.getUserFriends().add(subFriend);
            }
        }
        return friend;
    }

    // account
    @RequestMapping(value = "/account", method = RequestMethod.GET)
    public Utilisateur account() throws ServletException, IOException {
        Utilisateur userConnected = getPrincipal();
        Utilisateur user = userRepository.findOne(userConnected.getId());
        return user;
    }

    // emprunt histories
    @RequestMapping(value = "/historized-loans", method = RequestMethod.GET)
    public List<Emprunt> empruntsHistories() throws ServletException, IOException {
        Utilisateur userConnected = getPrincipal();
        List<Emprunt> emprunts = empruntRepository.findEmprunts(userConnected.getId(), false);

        for (Emprunt emp : emprunts) {
            Livre livre = userRepository.findBook(emp.getLivreId());
            LivreController.setBookImage(livre);
            setEmpruntOjects(emp);
        }
        return emprunts;
    }

    // My account
    @RequestMapping(value = "/historized-lendings", method = RequestMethod.GET)
    public List<Emprunt> pretHistories() throws ServletException, IOException {
        Utilisateur userConnected = getPrincipal();
        List<Emprunt> prets = empruntRepository.findPrets(userConnected.getId(), false);

        for (Emprunt pret : prets) {
            Livre livre = userRepository.findBook(pret.getLivreId());
            LivreController.setBookImage(livre);
            setEmpruntOjects(pret);
        }

        return prets;
    }

    private void setEmpruntOjects(Emprunt emp){
        emp.setPreteur(userRepository.findOne(emp.getPreteurId()));
        emp.setEmprunteur(userRepository.findOne(emp.getEmprunteurId()));
        Livre book = userRepository.findBook(emp.getLivreId());
        emp.setLivre(book);
    }

}
