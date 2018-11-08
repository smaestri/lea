package lea.modele;

import org.springframework.data.annotation.Transient;

import javax.validation.constraints.NotEmpty;
import java.util.ArrayList;
import java.util.List;

public class LivreModel extends BaseDocumentImpl  {

    @NotEmpty(message = "{validation.livremodel.notEmpty}")
    private String titreBook;

    private String description;

    private String auteur;

    private String editeur;

    private String image;

    private String isbn;

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

    public String getIsbn() {
        return isbn;
    }

    public void setIsbn(String isbn) {
        this.isbn = isbn;
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
