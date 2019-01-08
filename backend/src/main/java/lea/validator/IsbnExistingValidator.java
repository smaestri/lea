package lea.validator;

import lea.controller.CommonController;
import lea.modele.Livre;
import lea.modele.LivreModel;
import lea.modele.Utilisateur;
import lea.repository.livremodel.MongoLivreModelRepository;
import lea.repository.user.MongoUserRepository;
import lea.repository.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.util.List;

@Component
public class IsbnExistingValidator implements ConstraintValidator<IsbnExistingConstraint, String> {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MongoUserRepository mongoUserRepository;

    @Autowired
    private MongoLivreModelRepository mongoLivreModelRepository;

    @Override
    public boolean isValid(String isbn, ConstraintValidatorContext constraintValidatorContext) {
        Utilisateur principal = CommonController.getPrincipal();
        LivreModel livreexist = mongoLivreModelRepository.findByIsbn(isbn);
        if(livreexist != null) {
            Utilisateur user = this.mongoUserRepository.findById(principal.getId()).get();
            List<Livre> livres = user.getLivres();
            //check is user has already this Book
            for (Livre livre : livres) {
                if (livre.getLivreModelId().equals(livreexist.getId())) {
                    return false;
                }
            }
        }
        return true;
    }
}