package lea.controller;

import lea.modele.Emprunt;
import lea.modele.Livre;
import lea.modele.PendingFriend;
import lea.modele.Utilisateur;
import lea.repository.categorie.CategorieRepository;
import lea.repository.emprunt.EmpruntRepository;
import lea.repository.pendingfriend.PendingFriendRepository;
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
            model.addAttribute("hasFriend", !userDetail.getListFriendsId().isEmpty());
            model.addAttribute("hasFriend", !userDetail.getListFriendsId().isEmpty());
            model.addAttribute("categories", categorieRepository.findAll());

            // TODO find a bettar way to retrieve users
            List<PendingFriend> requestedFriends = pendingFriendRepository.findRequestedFriends(user.getEmail());
            List<Utilisateur> users = new ArrayList<Utilisateur>();
            for (PendingFriend pf : requestedFriends) {
                Utilisateur one = userRepository.findOne(pf.getUserId());
                users.add(one);
            }

            model.addAttribute("requestedFriends",users);

            //filtrer nombre d'emprunt actif
            Set<String> listPretsId = userDetail.getListPretsId();
            Set<String> listEmpruntsId = userDetail.getListEmpruntsId();

            int nbpret = 0;
            int nbemprunt = 0;

            for (String pretId : listPretsId) {
                Emprunt emp = empruntRepository.findOne(pretId);

                if (emp.isActif()) {
                    nbpret++;
                }
            }
            for (String empId : listEmpruntsId) {
                Emprunt emp = empruntRepository.findOne(empId);
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
