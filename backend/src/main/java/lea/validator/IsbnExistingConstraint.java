package lea.validator;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = IsbnExistingValidator.class)
@Target( { ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface IsbnExistingConstraint {
    String message() default "Book already inserted";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}