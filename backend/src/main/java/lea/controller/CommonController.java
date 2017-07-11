package lea.controller;

import lea.modele.Utilisateur;
import lea.repository.categorie.CategorieRepository;
import lea.repository.emprunt.EmpruntRepository;
import lea.repository.user.UserRepository;
import lea.service.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;

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


        /**
         * TODO COMMENT THIS
         */
//        Utilisateur u = new Utilisateur();
//        u.setEmail("toto@toto.com");
//        u.setId("58e95c2e0770d4577fadabe0");
//        return u;


    }
}
