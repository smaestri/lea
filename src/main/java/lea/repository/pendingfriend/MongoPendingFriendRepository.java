package lea.repository.pendingfriend;

import lea.modele.PendingFriend;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MongoPendingFriendRepository extends MongoRepository<PendingFriend, String> {

}
