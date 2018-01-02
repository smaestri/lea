package lea.controller;

import com.google.gson.Gson;
import lea.modele.Categorie;
import lea.modele.Livre;
import lea.modele.UserProfile;
import lea.modele.Utilisateur;
import lea.repository.userprofile.UserProfileRepository;
import lea.service.NotificationService;
import lea.service.UserSecurityService;
import lea.validator.PasswordValidator;
import lea.validator.UserValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * This controller is bound to spring Validation, not a restfull one
 */
@Controller
public class LoginController extends CommonController {

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private UserValidator userValidator;

    @Autowired
    private PasswordValidator passwordValidator;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserSecurityService userSecurityService;

    @RequestMapping(value = "/home")
    public String home(Model model) {
        return "home";
    }

    @Autowired
    private PasswordEncoder passwordEncoder;

    @RequestMapping(value = "/")
    public String welcomeHandler(Model model) {
        Utilisateur userSpring = getPrincipal();
        initGlobalvariables(model, false);
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

    // Creer un user : GET
    @RequestMapping(value = "/users/new", method = RequestMethod.GET)
    public String displayFormUser(Model model) {
        model.addAttribute("utilisateur", new Utilisateur());
        return "add-user";
    }

    // faq
    @RequestMapping(value = "/faq", method = RequestMethod.GET)
    public String faq(Model model) {
        return "faq";
    }

    // contact
    @RequestMapping(value = "/contact", method = RequestMethod.GET)
    public String contact(Model model) {
        return "contact";
    }

    // info
    @RequestMapping(value = "/info", method = RequestMethod.GET)
    public String info(Model model) {
        return "info";
    }

    // camarche
    @RequestMapping(value = "/camarche", method = RequestMethod.GET)
    public String camarche(Model model) {
        return "camarche";
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
            userDetail.setPassword(passwordEncoder.encode(user.getPassword()));
            userRepository.saveUser(userDetail);
            userSecurityService.authenticateManually(userDetail);
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

        // encrypt password
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        UserProfile profileUser = userProfileRepository.getProfileUser();
        List<String> set = new ArrayList<String>();
        set.add(profileUser.getId());
        user.setListUserProfilesId(set);
        user.setEnabled(true);
        userRepository.saveUser(user);

        // Authenticate manually
        userSecurityService.authenticateManually(user);

        return "redirect:/";
    }

    @RequestMapping("/getPwdEncoded")
    public void getPassEncoded() {
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String hashedPassword = passwordEncoder.encode("toto");
        System.out.println(hashedPassword);
    }

    /**
     * RESET PASSWORD
     *
     * @param model
     * @return
     */

    // Formulaire de reset mot de passe
    @RequestMapping(value = "/users/resetPwd", method = RequestMethod.GET)
    public String resetPwd(Model model) {
        model.addAttribute("utilisateur", new Utilisateur());
        return "forgot-pwd";
    }

    // reset pwd
    @RequestMapping(value = "/users/resetPwd", method = RequestMethod.POST)
    public String resetPassword(HttpServletRequest request, @RequestParam("email") String userEmail) throws InterruptedException {
        List<Utilisateur> listUsers = this.userRepository.findByEmail(userEmail);

        Utilisateur userFound = listUsers.get(0);

        String token = UUID.randomUUID().toString();
        userRepository.createPasswordResetTokenForUser(userFound, token);
        final String body = getAppUrl(request) + "/users/changePassword?id=" + userFound.getId() + "&token=" + token;
        notificationService.sendNotificaition(userFound.getEmail(), "Reset mot de passe", body);
        return "confirm-forgot-pwd";
    }

    @RequestMapping(value = "/users/changePassword", method = RequestMethod.GET)
    public String showChangePasswordPage(Model model,
                                         @RequestParam("id") String id, @RequestParam("token") String token) {
        String result = userSecurityService.validatePasswordResetToken(id, token);
        if (result != null) {
            return "redirect:/login";
        }
        return "redirect:/users/updatePassword";
    }

    /**
     * Show form with only new password to set
     *
     * @param model
     * @return
     */
    @RequestMapping(value = "/users/updatePassword", method = RequestMethod.GET)
    public String updatepassword(Model model) {
        model.addAttribute("utilisateur", new Utilisateur());
        return "update-pwd";
    }

    @RequestMapping(value = "/users/savePassword", method = RequestMethod.POST)
    public String savePassword(@Valid @ModelAttribute("utilisateur") Utilisateur user, BindingResult result) {
        Utilisateur userSpring = getPrincipal();
        passwordValidator.validate(user, result);
        if (result.hasErrors()) {
            return "update-pwd";
        }

        userSpring.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.saveUser(userSpring);
        return "update-passwd-success";
    }

    private String getAppUrl(HttpServletRequest request) {
        return "http://" + request.getServerName() + ":" + request.getServerPort() + request.getContextPath();
    }

    private Utilisateur initGlobalvariables(Model model, boolean shouldInitInputSearch) {
        Utilisateur userSpring = getPrincipal();
        if (userSpring != null && userSpring.getEmail() != null) {
            String userId = userSpring.getId();
            Utilisateur user = this.userRepository.findOne(userId);
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

            return user;
        }
        return null;
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