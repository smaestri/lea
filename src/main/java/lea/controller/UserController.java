package lea.controller;

import lea.modele.Emprunt;
import lea.modele.Livre;
import lea.modele.UserProfile;
import lea.modele.Utilisateur;
import lea.repository.emprunt.EmpruntRepository;
import lea.repository.livre.LivreRepository;
import lea.repository.userprofile.UserProfileRepository;
import lea.service.CustomUserDetailsService;
import lea.service.MailService;
import lea.validator.UserValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.servlet.ServletException;
import javax.validation.Valid;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Controller
public class UserController extends CommonController {

    @Autowired
    private EmpruntRepository empruntRepository;

    @Autowired
    private UserValidator userValidator;

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private LivreRepository livreRepository;

    @Autowired
    @Qualifier("mockMail")
    //@Qualifier("realMail")
    private MailService mailService;

    //Detail d'un utilisateur ; ses livres et ceux de ses amis
    @RequestMapping(value = "/users/{userId}", method = RequestMethod.GET)
    public String userDetail(@PathVariable("userId") String userDetail, Model model) throws ServletException, IOException {
        Utilisateur userConnected = initSearchFormAndPrincipal(model, false);
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

        model.addAttribute("user", friend);
        return "user/user-detail";
    }

    // My account
    @RequestMapping(value = "/account", method = RequestMethod.GET)
    public String account(Model model) throws ServletException, IOException {

        Utilisateur userConnected = initSearchFormAndPrincipal(model, false);
        if (userConnected == null) {
            return "redirect:/";
        }

        List<Emprunt> prets = empruntRepository.findPrets(userConnected.getId(), false);
        List<Emprunt> emprunts = empruntRepository.findEmprunts(userConnected.getId(), false);

        for (Emprunt pret : prets) {
            Livre livre = userRepository.findBook(pret.getLivreId());
            LivreController.setBookImage(livre);
            setEmpruntOjects(pret);
        }

        for (Emprunt emp : emprunts) {
            Livre livre = userRepository.findBook(emp.getLivreId());
            LivreController.setBookImage(livre);
            setEmpruntOjects(emp);
        }
        model.addAttribute("pretsHistories", prets);
        model.addAttribute("empruntsHistories", emprunts);
        //for my profile
        model.addAttribute("utilisateur", userRepository.findOne(userConnected.getId()));

        return "user/account";
    }

    private void setEmpruntOjects(Emprunt emp){
        emp.setPreteur(userRepository.findOne(emp.getPreteurId()));
        emp.setEmprunteur(userRepository.findOne(emp.getEmprunteurId()));
        Livre book = userRepository.findBook(emp.getLivreId());
        emp.setLivre(book);
    }

    // Creer un user : GET
    @RequestMapping(value = "/users/new", method = RequestMethod.GET)
    public ModelAndView displayFormUser(Model model) {
        initSearchFormAndPrincipal(model, false);
        model.addAttribute("utilisateur", new Utilisateur());
        return new ModelAndView("user/create-edit-user");
    }

    // Editer user : POSt
    @RequestMapping(value = "/users/edit", method = RequestMethod.POST)
    public String editUser(@Valid @ModelAttribute("utilisateur") Utilisateur user, BindingResult result, Model model) {

        if (!result.hasErrors()) {
            user.setEdit(true);
            userValidator.validate(user, result);
        }
        initSearchFormAndPrincipal(model, false);

        if (result.hasErrors()) {
            model.addAttribute("utilisateur", user);
            return "user/account";
        } else {
            Utilisateur userDetail = userRepository.findOne(user.getId());
            userDetail.setLastName(user.getLastName());
            userDetail.setFirstName(user.getFirstName());
            userDetail.setPassword(user.getPassword());
            userRepository.saveUser(userDetail);
            authenticateManually(userDetail);
            return "redirect:/";
        }
    }


    /**
     * Créer ou MAJ utilisateur
     *
     * @param user
     * @param model
     * @return
     */
    @RequestMapping(value = "/users/new", method = RequestMethod.POST)
    public String addUser(@Valid @ModelAttribute("utilisateur") Utilisateur user, BindingResult result, Model model) {

        if (!result.hasErrors()) {
            user.setEdit(false);
            //Check email
            boolean b = this.checkEmail(user.getEmail());
            if (!b) {
                result.rejectValue("email", "error_email");
            } else {
                // check email existing and password
                userValidator.validate(user, result);
            }
        }

        initSearchFormAndPrincipal(model, false);

        if (result.hasErrors()) {
            model.addAttribute("utilisateur", user);
            return "user/create-edit-user";
        }

        UserProfile profileUser = userProfileRepository.getProfileUser();
        List<String> set = new ArrayList<String>();
        set.add(profileUser.getId());
        user.setListUserProfilesId(set);
        user.setEnabled(true);
        userRepository.saveUser(user);

        // Authenticate manually
        authenticateManually(user);

        // si ce nouvel utilisateur est solicité en tant qu'ami alors rediriger sur la page adequate
        if(userRepository.findRequestedFriends(user.getEmail()).size() > 0){
            return "redirect:/myRequestedFriends";
        }
        return "redirect:/";

    }

    private void authenticateManually(Utilisateur user) {
        CustomUserDetailsService.UserPrincipal principal = new CustomUserDetailsService.UserPrincipal(user.getFirstName(), user.getPassword(), CustomUserDetailsService.getGrantedAuthorities(user), user);
        Authentication authentication = new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }



    public static boolean checkEmail(String email) {
        boolean result = true;
        try {
            InternetAddress emailAddr = new InternetAddress(email);
            emailAddr.validate();
        } catch (AddressException ex) {
            result = false;
        }
        return result;
    }


}
