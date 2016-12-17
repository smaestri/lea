package lea.controller;

import lea.modele.Emprunt;
import lea.modele.Livre;
import lea.modele.Utilisateur;
import lea.repository.categorie.CategorieRepository;
import lea.repository.emprunt.EmpruntRepository;
import lea.repository.user.UserRepository;
import lea.service.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.ui.Model;

import java.util.ArrayList;
import java.util.List;
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
    EmpruntRepository empruntRepository;

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
        Utilisateur userSpring = getPrincipal();

        if (userSpring != null && userSpring.getEmail() != null) {

            String userId = userSpring.getId();
            // nedd reload user
            Utilisateur user = this.userRepository.findOne(userId);
            model.addAttribute("userConnected", user);
            if (!shouldInitInputSearch) {
                model.addAttribute("command", new Livre());
            }
            model.addAttribute("hasFriend", !user.getListFriendsId().isEmpty());
            model.addAttribute("categories", categorieRepository.findAll());

            // Show the requested friends
            List<Utilisateur> requestedFriends = this.userRepository.findRequestedFriends(user.getEmail());
            model.addAttribute("requestedFriends", requestedFriends);

            //filtrer nombre d'emprunt actif
            List<String> listPretsId = user.getListPretsId();
            List<String> listEmpruntsId = user.getListEmpruntsId();
            int nbpret = 0;
            int nbemprunt = 0;

            if (listPretsId != null && listPretsId.size() > 0) {
                List<Emprunt> prets = empruntRepository.findAllEmprunts(listPretsId);
                nbpret = prets.size();
            }
            if (listPretsId != null && listPretsId.size() > 0) {
                List<Emprunt> emprunts = empruntRepository.findAllEmprunts(listEmpruntsId);
                nbemprunt = emprunts.size();
            }
            model.addAttribute("nbPrets", nbpret);
            model.addAttribute("nbEmprunts", nbemprunt);
            return user;
        }

        return null;
    }
}
