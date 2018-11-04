package lea.controller;

import com.google.gson.Gson;
import lea.commun.Utils;
import lea.modele.Categorie;
import lea.modele.Livre;
import lea.modele.Utilisateur;
import lea.repository.categorie.CategorieRepository;
import lea.repository.user.MongoUserRepository;
import lea.repository.user.UserRepository;
import lea.service.NotificationService;
import lea.service.UserSecurityService;
import lea.validator.PasswordValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.List;
import java.util.UUID;

public class PasswordRetrieverController extends CommonController{

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserSecurityService userSecurityService;

    @Autowired
    private MongoUserRepository mongoUserRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private CategorieRepository categorieRepository;


    @Autowired
    private PasswordValidator passwordValidator;

    @Autowired
    private PasswordEncoder passwordEncoder;


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
    public String resetPassword(HttpServletRequest request, @Valid @ModelAttribute("utilisateur") Utilisateur user, BindingResult result, Model model) throws InterruptedException {

        boolean b = Utils.checkEmail(user.getEmail());
        if (!b) {
            result.rejectValue("email", "error_email");
        }

        if (result.hasErrors()) {
            model.addAttribute("utilisateur", user);
            return "forgot-pwd";
        }

        List<Utilisateur> listUsers = this.userRepository.findByEmail(user.getEmail());

        if(listUsers == null || listUsers.isEmpty()){
            result.rejectValue("email", "error_email_not_found");
            model.addAttribute("utilisateur", user);
            return "forgot-pwd";
        }


        Utilisateur userFound = listUsers.get(0);

        String token = UUID.randomUUID().toString();
        userSecurityService.createPasswordResetTokenForUser(userFound, token);
        final String body = "Bonjour, une demande de nouveau mot de passe a été effectuée. Veuillez cliquer sur le lien suivant pour enregistrer un nouveau mot de passe : " +
                getAppUrl(request) + "/users/changePassword?id=" + userFound.getId() + "&token=" + token;
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
        // TODO
        //passwordValidator.validate(user, result);
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
            Utilisateur user = this.mongoUserRepository.findById(userId).get();
            model.addAttribute("userName", user.getFullName());
            if (!shouldInitInputSearch) {
                model.addAttribute("command", new Livre());
            }
            model.addAttribute("hasFriend", !user.getListFriendsId().isEmpty());

            // categories
            List<Categorie> all = this.categorieRepository.findAll();
            Gson gson = new Gson();
            String json = gson.toJson(all);
            model.addAttribute("categories", json);

            return user;
        }
        return null;
    }
}
