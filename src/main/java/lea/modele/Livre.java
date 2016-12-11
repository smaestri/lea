package lea.modele;

import lea.commun.StatutEmprunt;
import org.springframework.data.annotation.Id;

import java.util.Set;

public class Livre {

    @Id
    protected String id;

    private Utilisateur user;

    private String titreBook;

    private String description;

    private String auteur;

    private String editeur;

    private String image;

    private String isbn;

    private Categorie categorie;

    private StatutEmprunt statut;

    private Set<Avis> avis;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public Categorie getCategorie() {
        return categorie;
    }

    public void setCategorie(Categorie categorie) {
        this.categorie = categorie;
    }

    public Utilisateur getUser() {
        return user;
    }

    public void setUser(Utilisateur user) {
        this.user = user;
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

    public Set<Avis> getAvis() {
        return avis;
    }

    public void setAvis(Set<Avis> avis) {
        this.avis = avis;
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

    @Override
    public String toString() {
        return "Livre{" +
                "id=" + id +
                ", user=" + user +
                ", titreBook='" + titreBook + '\'' +
                ", description='" + description + '\'' +
                ", auteur='" + auteur + '\'' +
                ", editeur='" + editeur + '\'' +
                ", image='" + image + '\'' +
                ", isbn='" + isbn + '\'' +
                ", categorie=" + categorie +
                ", statut=" + statut +
                ", avis=" + avis + ((this.categorie != null) ? categorie.getId() + categorie.getLibelleCat() : "") +
                '}';
    }
}
