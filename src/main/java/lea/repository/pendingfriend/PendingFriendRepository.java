package lea.repository.pendingfriend;

import lea.modele.PendingFriend;
import lea.modele.Utilisateur;

import java.util.List;

public interface PendingFriendRepository {

    List<Utilisateur> findRequestedFriends(String mail);

    List<PendingFriend> findPendingFriends(String id);

    PendingFriend save(PendingFriend pf);
}
