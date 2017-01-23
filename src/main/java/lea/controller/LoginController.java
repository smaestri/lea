package lea.controller;

import com.google.gson.Gson;
import lea.modele.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;

@Controller
public class LoginController extends CommonController {

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

}