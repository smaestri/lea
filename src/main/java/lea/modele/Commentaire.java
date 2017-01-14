package lea.modele;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Transient;

import java.util.Date;

public class Commentaire extends BaseDocumentImpl implements Comparable<Commentaire> {

    private String auteur; //ID user
    private String message;
    private Date dateMessage;

    public Commentaire(){
        this.setId(ObjectId.get().toHexString());
    }

    @Transient
    private Utilisateur user;

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Date getDateMessage() {
        return dateMessage;
    }

    public void setDateMessage(Date dateMessage) {
        this.dateMessage = dateMessage;
    }

    public String getAuteur() {
        return auteur;
    }

    public void setAuteur(String auteur) {
        this.auteur = auteur;
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

    @Override
    public String toString() {
        return "Commentaire{" +
                ", message='" + message + '\'' +
                ", dateMessage=" + dateMessage +
                '}';
    }
}
