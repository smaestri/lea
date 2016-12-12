package lea.repository.pendingfriend;

import lea.modele.PendingFriend;
import lea.modele.Utilisateur;

import java.util.List;
import java.util.Set;

public interface PendingFriendRepository {

    List<PendingFriend> findRequestedFriends(String mail);

    List<PendingFriend> findPendingFriends(String id);

    PendingFriend save(PendingFriend pf);

    List<PendingFriend> findAll(Set<String> pendingFriendId);
}
