package lea.controller;

import lea.modele.Livre;
import lea.modele.Utilisateur;
import lea.configuration.security.CustomUserDetailsService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;

import java.util.Iterator;
import java.util.List;

/**
 * Created by sylvain on 10/01/16.
 */
public class CommonController {

    public static Utilisateur getPrincipal() {

        Utilisateur user = null;
        if (SecurityContextHolder.getContext().getAuthentication() == null) {
            return null;
        }

        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (principal instanceof CustomUserDetailsService.UserPrincipal) {
            user = ((CustomUserDetailsService.UserPrincipal) principal).getUser();

        }
        // FIXME FOR UNIT TEST
        else if (principal instanceof User) {
           return new Utilisateur();
        } else if (principal instanceof Utilisateur) {
            user = (Utilisateur) principal;
        }
        return user;
    }

}
