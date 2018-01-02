package lea.validator;

import lea.modele.Utilisateur;
import lea.repository.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

@Component
public class PasswordValidator implements Validator {

    @Autowired
    private UserRepository userRepository;

    @Override
    public boolean supports(Class clazz) {
        return Utilisateur.class.equals(clazz);
    }

    @Override
    public void validate(Object target, Errors errors) {
        Utilisateur user = (Utilisateur) target;
        if (!user.getPassword().equals(user.getConfirmPassword())) {
            errors.rejectValue("password", "error_password");
        }
    }
}