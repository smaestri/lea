package lea.repository.password;

import lea.modele.PasswordResetToken;
import org.springframework.data.mongodb.repository.MongoRepository;

/**
 * Created by sylvain on 11/12/16.
 */
public interface MongoPasswordResetRepository extends MongoRepository<PasswordResetToken, String> {

}
