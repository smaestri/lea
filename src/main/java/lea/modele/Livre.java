package lea.modele;

import lea.commun.StatutEmprunt;
import org.springframework.data.annotation.Id;

import java.util.Set;

public class Livre extends BaseDocumentImpl {


    // FK
    private String userId;
    private String categorieId;
    private Set<String> listAvisId;

    private String titreBook;

    private String description;

    private String auteur;

    private String editeur;

    private String image;

    private String isbn;

    private StatutEmprunt statut;


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



    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getCategorieId() {
        return categorieId;
    }

    public void setCategorieId(String categorieId) {
        this.categorieId = categorieId;
    }

    public Set<String> getListAvisId() {
        return listAvisId;
    }

    public void setListAvisId(Set<String> listAvisId) {
        this.listAvisId = listAvisId;
    }

    @Override
    public String toString() {
        return "Livre{" +
                "userId='" + userId + '\'' +
                ", categorieId='" + categorieId + '\'' +
                ", listAvisId=" + listAvisId +
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
