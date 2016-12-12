package lea.modele;

import java.util.Date;

public class Commentaire extends BaseDocumentImpl implements Comparable<Commentaire> {


    //FORIGN KEY
    private String empruntId;
    private String userId;

    private String message;
    private Date dateMessage;


    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getEmpruntId() {
        return empruntId;
    }

    public void setEmpruntId(String empruntId) {
        this.empruntId = empruntId;
    }

    public Date getDateMessage() {
        return dateMessage;
    }

    public void setDateMessage(Date dateMessage) {
        this.dateMessage = dateMessage;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
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
                "empruntId='" + empruntId + '\'' +
                ", message='" + message + '\'' +
                ", dateMessage=" + dateMessage +
                ", userId='" + userId + '\'' +
                '}';
    }
}
