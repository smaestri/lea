package lea.controller;

import lea.dto.AmiBean;
import lea.modele.Utilisateur;
import lea.service.MailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.StringUtils;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import javax.mail.MessagingException;
import java.io.UnsupportedEncodingException;
import java.util.List;
import java.util.Set;

/**
 * Created by sylvain on 17/12/16.
 */
@Controller
public class FriendController extends CommonController {

    @Autowired
    @Qualifier("mockMail")
    //@Qualifier("realMail")
    private MailService mailService;

    // My friends: GET
    @RequestMapping(value = "/myFriends", method = RequestMethod.GET)
    public String myFriends(Model model) {
        Utilisateur user = initSearchFormAndPrincipal(model, false);
        model.addAttribute("userFriends", userRepository.findFriends(user.getListFriendsId()));
        model.addAttribute("pendingFriends", user.getListPendingFriends());
        return "user/my-friends";
    }

    // My Pendingfriends: GET
    @RequestMapping(value = "/myRequestedFriends", method = RequestMethod.GET)
    public String mypendingFriends(Model model) {
        Utilisateur user = initSearchFormAndPrincipal(model, false);
        List<Utilisateur> requestedFriends = userRepository.findRequestedFriends(user.getEmail());
        if (requestedFriends.isEmpty()) {
            return "redirect:/";
        }
        model.addAttribute("requestedFriends", requestedFriends);
        return "user/my-requested-friends";
    }

    // Creer un ami : GET
    @RequestMapping(value = "/ami/new", method = RequestMethod.GET)
    public ModelAndView displayFormAmi(Model model) {
        model.addAttribute("ami", new AmiBean());
        initSearchFormAndPrincipal(model, false);
        return new ModelAndView("user/add-friend");
    }

    // Creer un ami : POST
    @RequestMapping(value = "/ami/new", method = RequestMethod.POST)
    public String addUser(@ModelAttribute("ami") AmiBean amiBean, Model model, BindingResult result) throws UnsupportedEncodingException, MessagingException {

        Utilisateur user = initSearchFormAndPrincipal(model, false);
        if (user == null) {
            return "redirect:/";
        }
        String emailEmetteur = user.getEmail();

        String emailFriend = amiBean.getEmail1();
        if (StringUtils.hasText(emailFriend) && UserController.checkEmail(emailFriend) && !emailFriend.equals(emailEmetteur)) {
            userRepository.addPendingFriend(user, emailFriend);
            String objet = "Livres entre Amis - Nouvelle demande d'ami";
            String contenu = emailEmetteur + " souhaite vous ajouter en tant qu'ami afin d'échanger des livres. Connectez-vous ou inscrivez vous sur livresentreamis.com afin de rentrer dans la communatuté!";
            this.mailService.sendEmail(objet, contenu, emailFriend, emailEmetteur);
        } else {
            result.rejectValue("email1", "error_email");
            model.addAttribute("ami", amiBean);
            return "user/add-friend";
        }
        return "redirect:/myFriends";
    }

    @RequestMapping(value = "/accepterAmi", method = RequestMethod.POST)
    public String accepterAmi(@ModelAttribute("friend_id") String idFriend, Model model) {
        Utilisateur userConnected = initSearchFormAndPrincipal(model, false);
        Utilisateur userFriend = userRepository.findOne(idFriend);

        addRealFriendAndDeletePending(userConnected, userFriend);
        addRealFriendAndDeletePending(userFriend, userConnected);

        return "redirect:/myFriends";
    }

    private void addRealFriendAndDeletePending(Utilisateur user, Utilisateur friend) {
        user.getListFriendsId().add(friend.getId());
        userRepository.saveUser(user);
        userRepository.deletePendingFriend(user, friend.getEmail());
    }
}
