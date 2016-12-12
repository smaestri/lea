package lea.dto;

import lea.modele.Livre;
import lea.modele.Utilisateur;

import java.util.List;

/**
 * Created by sylvain on 12/12/16.
 */
public class UtilisateurBean {
    private String firstName;

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    private String lastName;
    private List<Livre> livres;
    private List<Utilisateur> userFriends;

    public List<Utilisateur> getUserFriends() {
        return userFriends;
    }

    public void setUserFriends(List<Utilisateur> userFriends) {
        this.userFriends = userFriends;
    }

    public List<Livre> getLivres() {
        return livres;
    }



    public void setLivres(List<Livre> livres) {
        this.livres = livres;
    }
}
