package lea.controller;

import lea.dto.AmiBean;
import lea.modele.*;
import lea.repository.emprunt.EmpruntRepository;
import lea.repository.pendingfriend.PendingFriendRepository;
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
import org.springframework.util.StringUtils;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import javax.mail.MessagingException;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.servlet.ServletException;
import javax.validation.Valid;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.List;
import java.util.Set;

@Controller
public class UserController extends CommonController {

    @Autowired
    private EmpruntRepository empruntRepository;

    @Autowired
    private UserValidator userValidator;

    @Autowired
    private PendingFriendRepository pendingFriendRepository;

    @Autowired
    //@Qualifier("mockMail")
    @Qualifier("realMail")
    private MailService mailService;

    //Detail d'un utilisateur ; ses livres et ceux de ses amis
    @RequestMapping(value = "/users/{userId}", method = RequestMethod.GET)
    public String userDetail(@PathVariable("userId") String userDetail, Model model) throws ServletException, IOException {
        Utilisateur userConnected = initSearchFormAndPrincipal(model, false);

        //cause probleme with hibernate
        Utilisateur friend = userRepository.findOne(userDetail);

        Utilisateur userReturn = new Utilisateur();

        if (!friend.getLivres().isEmpty()) {
            for (Livre livre : friend.getLivres()) {
                LivreController.setBookImage(livre);
            }
            userReturn.setLivres(friend.getLivres());
        }

        for (Utilisateur user : friend.getUserFriends()) {
            if (user.getId() != userConnected.getId()) {
                user = userRepository.findOne(user.getId());
                for (Livre livre : user.getLivres()) {
                    LivreController.setBookImage(livre);
                }
                userReturn.getUserFriends().add(user);
            }
        }

        userReturn.setFirstName(friend.getFirstName());
        userReturn.setLastName(friend.getLastName());
        model.addAttribute("user", userReturn);
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


        for (Emprunt emp : prets) {
            LivreController.setBookImage(emp.getLivre());
        }
        model.addAttribute("pretsHistories", prets);
        for (Emprunt emp : emprunts) {
            LivreController.setBookImage(emp.getLivre());
        }
        model.addAttribute("empruntsHistories", emprunts);
        model.addAttribute("livre", new Livre());
        model.addAttribute("utilisateur", userRepository.findOne(userConnected.getId()));

        return "user/account";
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

        UserProfile profileUser = userRepository.getProfileUser();
        user.getUserProfiles().add(profileUser);
        user.setEnabled(true);
        userRepository.saveUser(user);

        // Authenticate manually
        authenticateManually(user);

        // si ce nouvel utilisateur est solicité en tant qu'ami alors rediriger sur la page adequate
        String mail = user.getEmail();
        List<Utilisateur> requestedFriends = pendingFriendRepository.findRequestedFriends(mail);
        if (requestedFriends.isEmpty()) {
            return "redirect:/";
        }
        return "redirect:/myRequestedFriends";
    }

    private void authenticateManually(Utilisateur user) {
        CustomUserDetailsService.UserPrincipal principal = new CustomUserDetailsService.UserPrincipal(user.getFirstName(), user.getPassword(), CustomUserDetailsService.getGrantedAuthorities(user), user);
        Authentication authentication = new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    // My friends: GET
    @RequestMapping(value = "/myFriends", method = RequestMethod.GET)
    public String myFriends(Model model) {
        Utilisateur user = initSearchFormAndPrincipal(model, false);
        model.addAttribute("user", userRepository.findOne(user.getId()));
        model.addAttribute("pendingFriends", pendingFriendRepository.findPendingFriends(user.getId()));
        return "user/my-friends";
    }

    // My Pendingfriends: GET
    @RequestMapping(value = "/myRequestedFriends", method = RequestMethod.GET)
    public String mypendingFriends(Model model) {
        Utilisateur user = initSearchFormAndPrincipal(model, false);
        List<Utilisateur> requestedFriends = pendingFriendRepository.findRequestedFriends(user.getEmail());
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

        Utilisateur userConnected = initSearchFormAndPrincipal(model, false);

        Utilisateur userDetail = userRepository.findOne(userConnected.getId());
        if (userConnected == null) {
            return "redirect:/";
        }
        String emailEmetteur = userConnected.getEmail();

        String emailFriend = amiBean.getEmail1();
        if (StringUtils.hasText(emailFriend) && checkEmail(emailFriend) && !emailFriend.equals(emailEmetteur)) {
            addPendingFriendAndSendMail(emailFriend, userDetail, emailEmetteur);
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
        Utilisateur userDetail = userRepository.findOne(userConnected.getId());
        Utilisateur userFriend = userRepository.findOne(idFriend);
        userDetail.getUserFriends().add(userFriend);
        userRepository.saveUser(userDetail);

        userFriend.getUserFriends().add(userDetail);
        userRepository.saveUser(userFriend);
        //Get pending friend of friend and desactivate

        Set<PendingFriend> pendingEmails = userFriend.getEmailUsers();
        String emailUserConnected = userDetail.getEmail();

        for (PendingFriend pf : pendingEmails) {
            if (pf.getEmail().equals(emailUserConnected)) {
                pf.setActif(false);
                pendingFriendRepository.save(pf);
            }
        }
        return "redirect:/myFriends";
    }

    private boolean checkEmail(String email) {
        boolean result = true;
        try {
            InternetAddress emailAddr = new InternetAddress(email);
            emailAddr.validate();
        } catch (AddressException ex) {
            result = false;
        }
        return result;
    }

    private void addPendingFriendAndSendMail(String email, Utilisateur user, String emailEmetteur) throws UnsupportedEncodingException, MessagingException {
        PendingFriend emailUser = new PendingFriend(email);
        emailUser.setUtilisateur(user);
        emailUser.setActif(true);
        pendingFriendRepository.save(emailUser);
        sendMailAmi(emailEmetteur, email);
    }

    private void sendMailAmi(String emetteur, String mailDestinataire) throws UnsupportedEncodingException, MessagingException {
        mailService.sendEmail(emetteur + " souhaite vous ajouter en tant qu'ami afin d'échanger des livres. Connectez-vous ou inscrivez vous sur livresentreamis.com afin de rentrer dans la communatuté!", mailDestinataire, "Livres entre Amis - Nouvelle demande d'ami");
    }

}
