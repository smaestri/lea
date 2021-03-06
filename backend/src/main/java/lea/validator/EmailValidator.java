package lea.validator;

import lea.modele.Utilisateur;
import lea.repository.user.MongoUserRepository;
import lea.repository.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.util.List;

@Component
public class EmailValidator implements ConstraintValidator<EmailConstraint, Utilisateur> {

    @Autowired
    private MongoUserRepository mongoUserRepository;

    @Override
    public boolean isValid(Utilisateur user, ConstraintValidatorContext constraintValidatorContext) {

        if(!user.isCreation()){
            return true;
        }

        List<Utilisateur> byEmail = mongoUserRepository.findByEmail(user.getEmail());
        if (byEmail != null && !byEmail.isEmpty()) {
            return false;
        }
        return true;
    }
}