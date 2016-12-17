package lea.repository.user;

import lea.modele.Livre;
import lea.modele.UserProfile;
import lea.modele.Utilisateur;

import java.util.List;
import java.util.Set;

public interface UserRepository {

    List<Utilisateur> findByEmail(String login);

    Utilisateur findOne(String id);

    boolean isFriend(Integer integer, Integer integer1);

    Utilisateur findIntermediaire(Utilisateur userSource, String id);

    Utilisateur saveUser(Utilisateur userDetail);

    void saveLivre(Utilisateur user, Livre livre);

    void supprimerLivre(String bookId, String userId);

    List<Utilisateur> findFriends(List<String> listFriendsId);

    void addPendingFriend(Utilisateur user, String emailFriend);

    List<Utilisateur>  findRequestedFriends(String email);

    void deletePendingFriend(Utilisateur userDetail, String pendingEmail);
}
