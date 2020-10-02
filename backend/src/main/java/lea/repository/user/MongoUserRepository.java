package lea.repository.user;

import lea.modele.Utilisateur;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

/**
 * Created by sylvain on 11/12/16.
 */
public interface MongoUserRepository extends MongoRepository<Utilisateur, String> {

    List<Utilisateur> findByEmail(String email);


}
