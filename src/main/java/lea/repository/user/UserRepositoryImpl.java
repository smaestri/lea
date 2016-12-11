package lea.repository.user;

import lea.modele.UserProfile;
import lea.modele.Utilisateur;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class UserRepositoryImpl implements UserRepository {

    @Autowired
    private MongoUserRepository mongoUserRepository = null;

    @Autowired
    private MongoTemplate mongoTemplate = null;

    @Override
    public List<Utilisateur> findByEmail(String email) {
        Criteria criteria = Criteria.where("email").in(email);
        Query query = new Query(criteria);
        return mongoTemplate.find(query, Utilisateur.class);
    }

    @Override
    public Utilisateur findOne(String id) {
        return mongoUserRepository.findOne(id);
    }

    @Override
    public boolean isFriend(Integer integer, Integer integer1) {
        return false;
    }

    @Override
    public Utilisateur findIntermediaire(Utilisateur userSource, String id) {
        return null;
    }

    @Override
    public Utilisateur saveUser(Utilisateur userDetail) {
        return mongoUserRepository.save(userDetail);
    }

    @Override
    public UserProfile getProfileUser() {
        Criteria criteria = Criteria.where("type").in("USER");
        Query query = new Query(criteria);
        mongoTemplate.find(query, UserProfile.class);
    }

}
