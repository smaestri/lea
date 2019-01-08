package lea.validator;

import lea.modele.Utilisateur;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

@Component
public class PasswordValidator implements ConstraintValidator<PasswordConstraint, Utilisateur> {

    @Override
    public boolean isValid(Utilisateur user, ConstraintValidatorContext constraintValidatorContext) {
        if (StringUtils.isEmpty(user.getPassword())&& StringUtils.isEmpty(user.getConfirmPassword())) {
            return true;
        }

        if (!user.getPassword().equals(user.getConfirmPassword())) {
            return false;
        }
        return true;

    }
}