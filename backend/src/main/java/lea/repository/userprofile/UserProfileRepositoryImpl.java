package lea.repository.userprofile;

import lea.modele.UserProfile;
import lea.modele.Utilisateur;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class UserProfileRepositoryImpl implements UserProfileRepository {

    @Autowired
    private MongoUserProfileRepository mongoUserRepository = null;

    @Autowired
    private MongoTemplate mongoTemplate = null;

    @Override
    public UserProfile getProfileUser() {

        mongoUserRepository.findAll();

        Criteria criteria = Criteria.where("type").in("USER");
        Query query = new Query(criteria);
        List<UserProfile> userProfiles = mongoTemplate.find(query, UserProfile.class);
        return userProfiles.get(0);
    }

}
