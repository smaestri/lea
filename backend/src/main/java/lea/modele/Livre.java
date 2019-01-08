package lea.modele;

import lea.commun.StatutEmprunt;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Transient;

import javax.validation.constraints.NotEmpty;
import java.util.ArrayList;
import java.util.List;

public class Livre extends BaseDocumentImpl {

    public Livre(){
        this.setId(ObjectId.get().toHexString());
    }

    private String livreModelId;

    private StatutEmprunt statut;

    @Transient
    private LivreModel livreModel;

    @Transient
    private String userId;

    @Transient
    private String intermediaireid;

    @Transient
    private String preteur;

    @Transient
    private String mailPreteur;

    public String getMailPreteur() {
        return mailPreteur;
    }

    public void setMailPreteur(String mailPreteur) {
        this.mailPreteur = mailPreteur;
    }

    public StatutEmprunt getStatut() {
        return statut;
    }

    public void setStatut(StatutEmprunt statut) {
        this.statut = statut;
    }

    public String getLivreModelId() {
        return livreModelId;
    }

    public void setLivreModelId(String livreModelId) {
        this.livreModelId = livreModelId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getIntermediaireid() {
        return intermediaireid;
    }

    public void setIntermediaireid(String intermediaireid) {
        this.intermediaireid = intermediaireid;
    }

    public String getPreteur() {
        return preteur;
    }

    public void setPreteur(String preteur) {
        this.preteur = preteur;
    }

    public LivreModel getLivreModel() {
        return livreModel;
    }

    public void setLivreModel(LivreModel livreModel) {
        this.livreModel = livreModel;
    }

    @Override
    public String toString() {
        return "Livre{" +
                ", id='" + this.getId() + '\'' +
                ", statut=" + statut +
                '}';
    }

}
