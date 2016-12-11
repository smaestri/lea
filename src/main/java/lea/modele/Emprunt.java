package lea.modele;

import org.springframework.data.annotation.Id;

import java.io.Serializable;
import java.util.Date;
import java.util.Set;

public class Emprunt implements Serializable {

    @Id
    protected String id;
    private Utilisateur emprunteur;
    private Utilisateur preteur;
    private Livre livre;
    private Date debutEmprunt;
    private Date finEmprunt;
    private boolean actif;
    private Date dateDemande;
    private Set<Commentaire> listeCommentaire;
    private String motifRefus;
    private String intermediaire;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getIntermediaire() {
        return intermediaire;
    }

    public void setIntermediaire(String intermediaire) {
        this.intermediaire = intermediaire;
    }

    public Set<Commentaire> getListeCommentaire() {
        return listeCommentaire;
    }

    public void setListeCommentaire(Set<Commentaire> listeCommentaire) {
        this.listeCommentaire = listeCommentaire;
    }

    public Utilisateur getEmprunteur() {
        return emprunteur;
    }

    public void setEmprunteur(Utilisateur emprunteur) {
        this.emprunteur = emprunteur;
    }

    public Utilisateur getPreteur() {
        return preteur;
    }

    public void setPreteur(Utilisateur preteur) {
        this.preteur = preteur;
    }

    public Livre getLivre() {
        return livre;
    }

    public void setLivre(Livre livre) {
        this.livre = livre;
    }

    public Date getDebutEmprunt() {
        return debutEmprunt;
    }

    public void setDebutEmprunt(Date debutEmprunt) {
        this.debutEmprunt = debutEmprunt;
    }

    public Date getFinEmprunt() {
        return finEmprunt;
    }

    public void setFinEmprunt(Date finEmprunt) {
        this.finEmprunt = finEmprunt;
    }

    public boolean isActif() {
        return actif;
    }

    public void setActif(boolean actif) {
        this.actif = actif;
    }

    public String getMotifRefus() {
        return motifRefus;
    }

    public void setMotifRefus(String motifRefus) {
        this.motifRefus = motifRefus;
    }

    public Date getDateDemande() {
        return dateDemande;
    }

    public void setDateDemande(Date dateDemande) {
        this.dateDemande = dateDemande;
    }

    public String toString() {
        return "preteur=" + this.preteur.getFirstName() + " emprunteur=" + this.emprunteur.getLastName() + " livre=" + this.livre.getId();
    }

}
