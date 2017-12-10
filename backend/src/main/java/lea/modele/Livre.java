package lea.modele;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lea.commun.StatutEmprunt;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Transient;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

public class Livre extends BaseDocumentImpl {

    public Livre(){
        this.setId(ObjectId.get().toHexString());
    }

    // FK
    private String categorieId;
    private List<Avis> avis = new ArrayList<Avis>();

    private String titreBook;

    private String description;

    private String auteur;

    private String editeur;

    private String image;

    private String isbn;

    private boolean deleted;

    @Transient
    private boolean isPending;

    private StatutEmprunt statut;

    @Transient
    private Categorie categorie;

    @Transient
    private String userId;

    @Transient
    private String intermediaireid;

    @Transient
    private String preteur;

    @Transient
    private boolean empruntable;

    @Transient
    private String mailPreteur;

    public List<Avis> getAvis() {
        return avis;
    }

    public void setAvis(List<Avis> avis) {
        this.avis = avis;
    }

    public String getAuteur() {
        return auteur;
    }

    public void setAuteur(String auteur) {
        this.auteur = auteur;
    }

    public String getTitreBook() {
        return titreBook;
    }

    public void setTitreBook(String titreBook) {
        this.titreBook = titreBook;
    }

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

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getIsbn() {
        return isbn;
    }

    public void setIsbn(String isbn) {
        this.isbn = isbn;
    }

    public String getEditeur() {
        return editeur;
    }

    public void setEditeur(String editeur) {
        this.editeur = editeur;
    }


    public String getPreteur() {
        return preteur;
    }

    public void setPreteur(String preteur) {
        this.preteur = preteur;
    }

    public String getCategorieId() {
        return categorieId;
    }

    public void setCategorieId(String categorieId) {
        this.categorieId = categorieId;
    }

    public Categorie getCategorie() {
        return categorie;
    }

    public void setCategorie(Categorie categorie) {
        this.categorie = categorie;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public void setEmpruntable(boolean empruntable) {
        this.empruntable = empruntable;
    }

    public boolean isEmpruntable() {
        return empruntable;
    }

    public String getIntermediaireid() {
        return intermediaireid;
    }

    public void setIntermediaireid(String intermediaireid) {
        this.intermediaireid = intermediaireid;
    }

    public boolean isPending() {
        return isPending;
    }

    public void setPending(boolean pending) {
        isPending = pending;
    }

    public boolean isDeleted() {
        return deleted;
    }

    public void setDeleted(boolean deleted) {
        this.deleted = deleted;
    }

    @Override
    public String toString() {
        return "Livre{" +
                ", id='" + this.getId() + '\'' +
                ", categorieId='" + categorieId + '\'' +
                ", titreBook='" + titreBook + '\'' +
                ", description='" + description + '\'' +
                ", auteur='" + auteur + '\'' +
                ", editeur='" + editeur + '\'' +
                ", image='" + image + '\'' +
                ", isbn='" + isbn + '\'' +
                ", statut=" + statut +
                '}';
    }

}
