package lea.controller;

import com.google.gson.Gson;
import lea.modele.*;
import lea.repository.userprofile.UserProfileRepository;
import lea.service.CustomUserDetailsService;
import lea.validator.UserValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.util.ArrayList;
import java.util.List;

/**
 * This controller is bound to spring Validation, not a restfull one
 */
@Controller
public class LoginController extends CommonController {

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private UserValidator userValidator;

    @RequestMapping(value = "/")
    public String welcomeHandler(Model model) {
        initGlobalvariables(model, false);
        List<Avis> avis = null; //avisRepository.getLastAvis();
        model.addAttribute("avis", avis);
        return "index";
    }

    @RequestMapping("/mentions")
    public String mentionslegales() {
        return "mentions";
    }

    @RequestMapping("/comment")
    public String commentCaMarche() {
        return "commentcamarche";
    }

    // Formulaire de connexion
    @RequestMapping(value = "/login", method = RequestMethod.GET)
    public String login(Model model) {
        model.addAttribute("livre", new Livre());
        return "login";
    }

    // Echec authentificaiton
    @RequestMapping(value = "/loginfailed", method = RequestMethod.GET)
    public String loginerror(Model model) {
        return "redirect:/login?error";
    }

    // Deconnexion
    @RequestMapping(value = "/logout", method = RequestMethod.GET)
    public String logoutPage(HttpServletRequest request, HttpServletResponse response) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null) {
            new SecurityContextLogoutHandler().logout(request, response, auth);
        }
        return "redirect:/login?logout";
    }

    private Utilisateur initGlobalvariables(Model model, boolean shouldInitInputSearch) {
        Utilisateur userSpring = getPrincipal();
        if (userSpring != null && userSpring.getEmail() != null) {
            String userId = userSpring.getId();
            Utilisateur user = this.userRepository.findOne(userId);
            model.addAttribute("userId", user.getId());
            model.addAttribute("userName", user.getFullName());
            if (!shouldInitInputSearch) {
                model.addAttribute("command", new Livre());
            }
            model.addAttribute("hasFriend", !user.getListFriendsId().isEmpty());

            // categories
            List<Categorie> all = categorieRepository.findAll();
            Gson gson = new Gson();
            String json = gson.toJson(all);
            model.addAttribute("categories", json);

            //  requested friends
            List<Utilisateur> requestedFriends = this.userRepository.findRequestedFriends(user.getEmail());
            if (model != null) {
                model.addAttribute("requestedFriends", requestedFriends);
            }

            // Nb emprunt prets
            List<Emprunt> emprunts = empruntRepository.findEmprunts(userSpring.getId(), true);
            List<Emprunt> prets = empruntRepository.findPrets(userSpring.getId(), true);
                model.addAttribute("nbPrets", prets.size());
                model.addAttribute("nbEmprunts", emprunts.size());
            return user;
        }
        return null;
    }

    // Creer un user : GET
    @RequestMapping(value = "/users/new", method = RequestMethod.GET)
    public String displayFormUser(Model model) {
        model.addAttribute("utilisateur", new Utilisateur());
        return "add-user";
    }

    // Editer user : POSt
    @RequestMapping(value = "/users/edit", method = RequestMethod.POST)
    public String editUser(@Valid @ModelAttribute("utilisateur") Utilisateur user, BindingResult result, Model model) {
        if (!result.hasErrors()) {
            user.setEdit(true);
            userValidator.validate(user, result);
        }

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

    @RequestMapping(value = "/users/new", method = RequestMethod.POST)
    public String addUser(@Valid @ModelAttribute("utilisateur") Utilisateur user, BindingResult result, Model model) {

        user.setEdit(false);
        //Check email
        boolean b = this.checkEmail(user.getEmail());
        if (!b) {
            result.rejectValue("email", "error_email");
        } else {
            // check email existing and password
            userValidator.validate(user, result);
        }

        if (result.hasErrors()) {
            model.addAttribute("utilisateur", user);
            return "add-user";
        }

        UserProfile profileUser = userProfileRepository.getProfileUser();
        List<String> set = new ArrayList<String>();
        set.add(profileUser.getId());
        user.setListUserProfilesId(set);
        user.setEnabled(true);
        userRepository.saveUser(user);

        // Authenticate manually
        authenticateManually(user);

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