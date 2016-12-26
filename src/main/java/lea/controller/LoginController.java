package lea.controller;

import lea.modele.Avis;
import lea.modele.Livre;
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
        initSearchFormAndPrincipal(model, false);
        List<Avis> avis = null; //avisRepository.getLastAvis();
        model.addAttribute("avis", avis);
        return "index";
    }

    @RequestMapping("/mentions")
    public String mentionslegales(Model model) {
        initSearchFormAndPrincipal(model, false);
        return "mentions";
    }

    @RequestMapping("/comment")
    public String commentCaMarche(Model model) {
        this.initSearchFormAndPrincipal(model, false);
        return "commentcamarche";
    }

    // Formulaire de connexion
    @RequestMapping(value = "/login", method = RequestMethod.GET)
    public String login(Model model) {
        initSearchFormAndPrincipal(model, false);
        model.addAttribute("livre", new Livre());
        return "login";
    }

    // Echec authentificaiton
    @RequestMapping(value = "/loginfailed", method = RequestMethod.GET)
    public String loginerror(Model model) {
        initSearchFormAndPrincipal(model, false);
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

}