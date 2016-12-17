package lea.modele;

import java.util.Date;

public class Avis extends BaseDocumentImpl {

    // FOREIGN KEY
    private String userId;

    private String libelle;

    private int note;

    private Date dateavis;

    public String getLibelle() {
        return libelle;
    }

    public void setLibelle(String libelle) {
        this.libelle = libelle;
    }

    public int getNote() {
        return note;
    }

    public void setNote(int note) {
        this.note = note;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    @Override
    public String toString() {
        return "Avis{" +
                ", userId=" + userId +
                ", libelle='" + libelle + '\'' +
                ", note=" + note +
                ", dateavis=" + dateavis +
                '}';
    }

    public Date getDateavis() {
        return dateavis;
    }

    public void setDateavis(Date dateavis) {
        this.dateavis = dateavis;
    }
}
