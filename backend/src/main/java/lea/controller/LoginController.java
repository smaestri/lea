package lea.controller;

import lea.modele.UserProfile;
import lea.modele.Utilisateur;
import lea.repository.user.MongoUserRepository;
import lea.repository.user.UserRepository;
import lea.repository.userprofile.UserProfileRepository;
import lea.service.UserSecurityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.List;


@RestController
public class LoginController extends CommonController {

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

    @RequestMapping(value = "/home")
    public String home(Model model) {
        return "home";
    }


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

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        UserProfile profileUser = userProfileRepository.getProfileUser();
        List<String> set = new ArrayList<>();
        set.add(profileUser.getId());
        user.setListUserProfilesId(set);
        user.setEnabled(true);
        userRepository.saveUser(user);
        userSecurityService.authenticateManually(user);
        ResponseEntity responseEntity = new ResponseEntity(user, HttpStatus.OK);
        return responseEntity;
    }

}