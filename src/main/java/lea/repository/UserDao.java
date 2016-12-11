//package lea.repository;
//
//import java.util.List;
//
//import lea.modele.PendingFriend;
//import lea.modele.UserProfile;
//import lea.modele.Utilisateur;
//
//public interface UserDao {
//
//	 Utilisateur findUsers(Integer idUser);
//	 List<Utilisateur> findByEmail(String email);
//	 List<Utilisateur> findByName(String name);
//	 Utilisateur getUserDetail(Integer idUser);
//     Utilisateur getUserDetailWithFriendBooks(Integer idUser, Integer mailConnected);
//	 Utilisateur ajouterUser(Utilisateur user);
//	 boolean isFriend(int idUser1, int iduser2);
//	 UserProfile getProfileUser();
//	 PendingFriend addPendingFriend(PendingFriend emailuser);
//     List<Utilisateur> findRequestedFriends(String mail);
//     List<PendingFriend>  findPendingFriends(Integer idUser);
//	 void desactivatePendingFriend(PendingFriend emailUser);
//	Utilisateur findIntermediaire(Utilisateur principal, int idsubFriend);
//}
