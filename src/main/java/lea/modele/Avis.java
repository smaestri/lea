package lea.modele;

import org.springframework.data.annotation.Transient;

import java.util.Date;

public class Avis extends BaseDocumentImpl {

    // FOREIGN KEY
    private String auteur;

    @Transient
    private String bookId;

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

    public String getAuteur() {
        return auteur;
    }

    public void setAuteur(String auteur) {
        this.auteur = auteur;
    }

    @Override
    public String toString() {
        return "Avis{" +
                ", auteur=" + auteur +
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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Avis avis = (Avis) o;

        return this.getId().equals(avis.getId());
//        if (auteur != null ? !auteur.equals(avis.auteur) : avis.auteur != null) return false;
//        if (libelle != null ? !libelle.equals(avis.libelle) : avis.libelle != null) return false;
//        return dateavis != null ? dateavis.equals(avis.dateavis) : avis.dateavis == null;

    }

    @Override
    public int hashCode() {
        int result = auteur != null ? auteur.hashCode() : 0;
        result = 31 * result + (libelle != null ? libelle.hashCode() : 0);
        result = 31 * result + note;
        result = 31 * result + (dateavis != null ? dateavis.hashCode() : 0);
        return result;
    }

    public String getBookId() {
        return bookId;
    }

    public void setBookId(String bookId) {
        this.bookId = bookId;
    }
}
