package lea.repository.user;

import lea.modele.Utilisateur;
import org.springframework.data.mongodb.repository.MongoRepository;

/**
 * Created by sylvain on 11/12/16.
 */
public interface MongoUserRepository extends MongoRepository<Utilisateur, String> {

}
