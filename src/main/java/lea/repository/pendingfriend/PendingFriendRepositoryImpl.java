package lea.repository.pendingfriend;

import lea.modele.PendingFriend;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
class PendingFriendRepositoryImpl implements PendingFriendRepository {

    @Autowired
    private MongoPendingFriendRepository mongoPendingFriendRepository = null;

    @Autowired
    private MongoTemplate mongoTemplate = null;

    @Override
    public List<PendingFriend> findRequestedFriends(String mail) {
        Criteria criteria = Criteria.where("email").in(mail).and("actif").is(true);
        Query query = new Query(criteria);
        List<PendingFriend> pendingFriends = mongoTemplate.find(query, PendingFriend.class);
        return pendingFriends;
    }

    @Override
    public List<PendingFriend> findPendingFriends(String id) {
        Criteria criteria = Criteria.where("utilisateur.id").in(id).and("actif").is(true);
        Query query = new Query(criteria);
        List<PendingFriend> pendingFriends = mongoTemplate.find(query, PendingFriend.class);
        return pendingFriends;
    }

    @Override
    public PendingFriend save(PendingFriend pf) {
        return mongoPendingFriendRepository.save(pf);
    }

    @Override
    public List<PendingFriend> findAll(Set<String> pendingFriendId) {
        Criteria criteria = Criteria.where("id").in(pendingFriendId);
        Query query = new Query(criteria);
        List<PendingFriend> pendingFriends = mongoTemplate.find(query, PendingFriend.class);
        return pendingFriends;
    }

}
