package lea.repository.userprofile;

import lea.modele.UserProfile;
import org.springframework.data.mongodb.repository.MongoRepository;

/**
 * Created by sylvain on 11/12/16.
 */
public interface MongoUserProfileRepository extends MongoRepository<UserProfile, String> {

    UserProfile findByType(String type);

}
