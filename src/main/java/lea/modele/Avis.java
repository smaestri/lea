package lea.modele;

import org.springframework.data.annotation.Id;

import java.util.Date;

public class Avis {

    @Id
    protected String id;

    private Livre livre;

    private Utilisateur auteur;

    private String libelle;

    private int note;

    private Date dateavis;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Livre getLivre() {
        return livre;
    }

    public void setLivre(Livre livre) {
        this.livre = livre;
    }

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

    public Utilisateur getAuteur() {
        return auteur;
    }

    public void setAuteur(Utilisateur auteur) {
        this.auteur = auteur;
    }

    @Override
    public String toString() {
        return "Avis{" +
                "id='" + id + '\'' +
                ", livre=" + livre +
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
}
