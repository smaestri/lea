package lea.repository.user;

import lea.modele.UserProfile;
import lea.modele.Utilisateur;

import java.util.List;

public interface UserRepository {

    List<Utilisateur> findByEmail(String login);

    Utilisateur findOne(String id);

    boolean isFriend(Integer integer, Integer integer1);

    Utilisateur findIntermediaire(Utilisateur userSource, String id);

    Utilisateur saveUser(Utilisateur userDetail);

    UserProfile getProfileUser();

}
