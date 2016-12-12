package lea.controller;

import lea.modele.Emprunt;
import lea.modele.Livre;
import lea.modele.Utilisateur;
import lea.repository.categorie.CategorieRepository;
import lea.repository.pendingfriend.PendingFriendRepository;
import lea.repository.user.UserRepository;
import lea.service.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.ui.Model;

import java.util.Set;

/**
 * Created by sylvain on 10/01/16.
 */
public class CommonController {

    @Autowired
    CategorieRepository categorieRepository;

    @Autowired
    UserRepository userRepository;


    @Autowired
    PendingFriendRepository pendingFriendRepository;

    protected Utilisateur getPrincipal() {
        Utilisateur user = null;
        if (SecurityContextHolder.getContext().getAuthentication() == null) {
            return null;
        }

        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (principal instanceof CustomUserDetailsService.UserPrincipal) {
            user = ((CustomUserDetailsService.UserPrincipal) principal).getUser();
        }
        return user;
    }


    protected Utilisateur initSearchFormAndPrincipal(Model model, boolean shouldInitInputSearch) {
        Utilisateur user = getPrincipal();
        if (user != null && user.getEmail() != null) {
            model.addAttribute("userConnected", user);
            if (!shouldInitInputSearch) {
                model.addAttribute("command", new Livre());
            }

            Utilisateur userDetail = userRepository.findOne(user.getId());
            model.addAttribute("hasFriend", !userDetail.getUserFriends().isEmpty());
            model.addAttribute("hasFriend", !userDetail.getUserFriends().isEmpty());
            model.addAttribute("categories", categorieRepository.findAll());
            model.addAttribute("requestedFriends", pendingFriendRepository.findRequestedFriends(user.getEmail()));

            //filtrer nombre d'emprunt actif
            Set<Emprunt> prets = userDetail.getPrets();
            Set<Emprunt> emprunts = userDetail.getEmprunts();

            int nbpret = 0;
            int nbemprunt = 0;

            for (Emprunt emp : prets) {
                if (emp.isActif()) {
                    nbpret++;
                }
            }
            for (Emprunt emp : emprunts) {
                if (emp.isActif()) {
                    nbemprunt++;
                }
            }
            model.addAttribute("nbPrets", nbpret);
            model.addAttribute("nbEmprunts", nbemprunt);
            return userDetail;
        }

        return user;
    }
}
