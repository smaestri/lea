package lea.modele;

import lea.validator.IsbnExistingConstraint;
import org.hibernate.validator.constraints.Length;
import org.springframework.data.annotation.Transient;

import javax.validation.constraints.NotEmpty;
import java.util.ArrayList;
import java.util.List;



public class LivreModel extends BaseDocumentImpl  {

//    @NotEmpty(message = "{validation.livre.isbn_notEmpty}")
//    @Length(min = 10, message = "{validation.livre.isbn_size}")
    //@IsbnExistingConstraint(message = "{validation.livre.isbn_already_existing}")
    private String isbn10;

//    @NotEmpty(message = "{validation.livre.isbn_notEmpty}")
//    @Length(min = 10, message = "{validation.livre.isbn_size}")
    //@IsbnExistingConstraint(message = "{validation.livre.isbn_already_existing}")
    private String isbn13;

    private String titreBook;

    private String description;

    private String auteur;

    private String editeur;

    private String image;



    private String categorieId;

    @Transient
    private Categorie categorie;

    private List<Avis> avis = new ArrayList<Avis>();

    public String getCategorieId() {
        return categorieId;
    }

    public void setCategorieId(String categorieId) {
        this.categorieId = categorieId;
    }

    public String getTitreBook() {
        return titreBook;
    }

    public void setTitreBook(String titreBook) {
        this.titreBook = titreBook;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAuteur() {
        return auteur;
    }

    public void setAuteur(String auteur) {
        this.auteur = auteur;
    }

    public String getEditeur() {
        return editeur;
    }

    public void setEditeur(String editeur) {
        this.editeur = editeur;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }


    public String getIsbn10() {
        return isbn10;
    }

    public void setIsbn10(String isbn10) {
        this.isbn10 = isbn10;
    }

    public String getIsbn13() {
        return isbn13;
    }

    public void setIsbn13(String isbn13) {
        this.isbn13 = isbn13;
    }

    public List<Avis> getAvis() {
        return avis;
    }

    public void setAvis(List<Avis> avis) {
        this.avis = avis;
    }

    public Categorie getCategorie() {
        return categorie;
    }

    public void setCategorie(Categorie categorie) {
        this.categorie = categorie;
    }
}
