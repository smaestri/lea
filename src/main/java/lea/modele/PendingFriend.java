package lea.modele;

import org.springframework.data.annotation.Id;

import java.io.Serializable;

public class PendingFriend implements Serializable {

    @Id
    protected String id;

    private String email;

    private Boolean actif;

    private Utilisateur utilisateur;

    public PendingFriend(String email) {
        this.email = email;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Utilisateur getUtilisateur() {
        return utilisateur;
    }

    public void setUtilisateur(Utilisateur utilisateur) {
        this.utilisateur = utilisateur;
    }

    public Boolean isActif() {
        return actif;
    }

    public void setActif(Boolean actif) {
        this.actif = actif;
    }
}
