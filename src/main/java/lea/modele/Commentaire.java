package lea.modele;

import org.springframework.data.annotation.Id;

import java.util.Date;


public class Commentaire implements Comparable<Commentaire> {

    @Id
    protected String id;
    private Emprunt emprunt;
    private String message;
    private Date dateMessage;
    private Utilisateur user;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Emprunt getEmprunt() {
        return emprunt;
    }

    public void setEmprunt(Emprunt emprunt) {
        this.emprunt = emprunt;
    }

    public Date getDateMessage() {
        return dateMessage;
    }

    public void setDateMessage(Date dateMessage) {
        this.dateMessage = dateMessage;
    }

    public Utilisateur getUser() {
        return user;
    }

    public void setUser(Utilisateur user) {
        this.user = user;
    }

    @Override
    public int compareTo(Commentaire o) {
        if (this.dateMessage != null && o.getDateMessage() != null) {
            return dateMessage.compareTo(o.getDateMessage());
        }
        return 0;
    }
}
