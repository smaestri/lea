package lea.modele;

import org.bson.types.ObjectId;

import java.util.Date;

public class PendingFriend extends BaseDocumentImpl {

    private String email;
    private Date dateDemande;

    public PendingFriend(){
        this.setId(ObjectId.get().toHexString());
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Date getDateDemande() {
        return dateDemande;
    }

    public void setDateDemande(Date dateDemande) {
        this.dateDemande = dateDemande;
    }
}
