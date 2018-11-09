package lea.repository.user;

import lea.commun.StatutEmprunt;
import lea.modele.*;

import java.util.List;
import java.util.Optional;

public interface UserRepository {

    List<Utilisateur> findByEmail(String login);
    List<Utilisateur> findAll();
    Utilisateur saveUser(Utilisateur userDetail);
    void saveLivre(Utilisateur user, Livre livre);
    void supprimerLivre(String bookId, String userId);
    List<Utilisateur> findFriends(List<String> listFriendsId);
    void addPendingFriend(Utilisateur user, PendingFriend pf);
    List<Utilisateur> findRequestedFriends(String email);
    void deleteFriend(String idUserConnected, String pendingEmail);
    void deletePendingFriend(Utilisateur userDetail, String pendingEmail);
    Optional<Livre> findBook(String id);
    void updateBookStatus(Utilisateur proprietaire, String livreId, StatutEmprunt status);
    public void deleteAvis(String idAvis);
    public Utilisateur findproprietaire(String bookId);
    PendingFriend findPendingFriend(Utilisateur user, String email);
    List<Avis> findlastAvis();
	void findBookByModelId();
}
