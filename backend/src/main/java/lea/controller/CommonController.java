package lea.controller;

import lea.modele.Livre;
import lea.modele.PendingFriend;
import lea.modele.Utilisateur;
import lea.repository.categorie.CategorieRepository;
import lea.repository.emprunt.EmpruntRepository;
import lea.repository.user.UserRepository;
import lea.service.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Iterator;
import java.util.List;

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
        } else if (principal instanceof Utilisateur) {
            user = (Utilisateur) principal;
        }
        return user;
    }

    protected void removeDeletedBooks(List<Livre> livres) {
        // remove book deleted
        Iterator<Livre> i = livres.iterator();
        while (i.hasNext()) {
            Livre l = i.next(); // must be called before you can call i.remove()
            if (l.isDeleted()) {
                i.remove();
            }
        }
    }

    protected void addRealFriendAndDeletePending(Utilisateur user, Utilisateur friend) {
        user.getListFriendsId().add(friend.getId());
        userRepository.saveUser(user);

        // find my pending friend from this user
        PendingFriend pf = userRepository.findPendingFriend(user, friend.getEmail());
        if (pf != null) {
            userRepository.deletePendingFriend(user, pf.getId());
        }
    }
}
