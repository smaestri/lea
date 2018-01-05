package lea.validator;

import lea.modele.Utilisateur;
import lea.repository.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

import java.util.List;

@Component
public class UserValidator implements Validator {

    @Autowired
    private UserRepository userRepository;

    @Override
    public boolean supports(Class clazz) {
        return Utilisateur.class.equals(clazz);
    }

    @Override
    public void validate(Object target, Errors errors) {
        Utilisateur user = (Utilisateur) target;
        List<Utilisateur> byEmail = userRepository.findByEmail(user.getEmail());
        if (byEmail != null && !byEmail.isEmpty()) {
            errors.rejectValue("email", "email_already_existing");
        }
        if (!user.getPassword().equals(user.getConfirmPassword())) {
            errors.rejectValue("password", "error_password");
        }
    }
}