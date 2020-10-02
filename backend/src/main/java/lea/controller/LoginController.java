package lea.controller;

import lea.modele.UserProfile;
import lea.modele.Utilisateur;
import lea.repository.user.MongoUserRepository;
import lea.repository.user.UserRepository;
import lea.repository.userprofile.UserProfileRepository;
import lea.service.NotificationService;
import lea.service.UserSecurityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.mail.MessagingException;
import javax.validation.Valid;
import java.util.ArrayList;
import java.util.List;


@RestController
public class LoginController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MongoUserRepository mongoUserRepository;

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private UserSecurityService userSecurityService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private NotificationService notificationService;


    // Editer user
    @RequestMapping(value = "/api/editUser", method = RequestMethod.POST)
    public Utilisateur editUser(@Valid @RequestBody Utilisateur user ){
            Utilisateur userDetail = mongoUserRepository.findById(user.getId()).get();
            userDetail.setLastName(user.getLastName());
            userDetail.setFirstName(user.getFirstName());
            userDetail.setPassword(passwordEncoder.encode(user.getPassword()));
            userRepository.saveUser(userDetail);
            userSecurityService.authenticateManually(userDetail);
            return userDetail;
    }

    @RequestMapping(value = "/api/createUser", method = RequestMethod.POST)
    public ResponseEntity addUser(@Valid @RequestBody Utilisateur user) {

        UserProfile profileUser = userProfileRepository.getProfileUser();
        List<String> set = new ArrayList<>();
        set.add(profileUser.getId());
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setListUserProfilesId(set);
        user.setEnabled(true);
        userRepository.saveUser(user);
        userSecurityService.authenticateManually(user);
        ResponseEntity responseEntity = new ResponseEntity(user, HttpStatus.OK);
        try {
            this.notificationService.confirmSubscription(user.getEmail(), user.getFullName());
        } catch (MessagingException e) {
            System.out.println("Erreur lors de l'envoi du mail");
        }
        return responseEntity;
    }

}