package lea.commun;

import lea.validator.EmailValidator;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = EmailValidator.class)
@Target( { ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface EmailConstraint {
    String message() default "Mail already used";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}