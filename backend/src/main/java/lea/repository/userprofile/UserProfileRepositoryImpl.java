package lea.repository.userprofile;

import lea.modele.UserProfile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class UserProfileRepositoryImpl implements UserProfileRepository {

    @Autowired
    private MongoUserProfileRepository mongoUserProfileRepository = null;

    @Autowired
    private MongoTemplate mongoTemplate = null;

    @Override
    public UserProfile getProfileUser() {
        return mongoUserProfileRepository.findByType("USER");
    }

}
