package lea.modele;

import org.springframework.data.annotation.Transient;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class Emprunt extends BaseDocumentImpl implements Serializable {

    // FOREIGN KEYS
    private String emprunteurId;
    private String preteurId;
    private String livreId;
    private String livreModelId;

    private Date debutEmprunt;
    private Date finEmprunt;
    private boolean actif;
    private Date dateAccept;
    private Date dateRefus;
    private Date dateDemande;
    private Date dateEnvoi;
    private Date dateCloture;

    private String motifRefus;
    private String intermediaire;

    private List<Commentaire> commentaires = new ArrayList<Commentaire>();

    @Transient
    private Utilisateur preteur;
    @Transient
    private Utilisateur emprunteur;
    @Transient
    private Livre livre;
    @Transient
    private LivreModel livreModel;

    public String getIntermediaire() {
        return intermediaire;
    }

    public void setIntermediaire(String intermediaire) {
        this.intermediaire = intermediaire;
    }

    public String getLivreId() {
        return livreId;
    }

    public void setLivreId(String livreId) {
        this.livreId = livreId;
    }

    public String getEmprunteurId() {
        return emprunteurId;
    }

    public void setEmprunteurId(String emprunteurId) {
        this.emprunteurId = emprunteurId;
    }

    public String getPreteurId() {
        return preteurId;
    }

    public void setPreteurId(String preteurId) {
        this.preteurId = preteurId;
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

    public List<Commentaire> getCommentaires() {
        return commentaires;
    }

    public void setCommentaires(List<Commentaire> commentaires) {
        this.commentaires = commentaires;
    }


    public Date getDateEnvoi() {
        return dateEnvoi;
    }

    public void setDateEnvoi(Date dateEnvoi) {
        this.dateEnvoi = dateEnvoi;
    }

    public Date getDateCloture() {
        return dateCloture;
    }

    public void setDateCloture(Date dateCloture) {
        this.dateCloture = dateCloture;
    }


    public Date getDateAccept() {
        return dateAccept;
    }

    public void setDateAccept(Date dateAccept) {
        this.dateAccept = dateAccept;
    }

    public Date getDateRefus() {
        return dateRefus;
    }

    public void setDateRefus(Date dateRefus) {
        this.dateRefus = dateRefus;
    }

    @Override
    public String toString() {
        return "Emprunt{" +
                "emprunteurId='" + emprunteurId + '\'' +
                ", preteurId='" + preteurId + '\'' +
                ", livreId='" + livreId + '\'' +
                ", debutEmprunt=" + debutEmprunt +
                ", finEmprunt=" + finEmprunt +
                ", actif=" + actif +
                ", dateDemande=" + dateDemande +
                ", motifRefus='" + motifRefus + '\'' +
                ", intermediaire='" + intermediaire + '\'' +
                '}';
    }

    public void setPreteur(Utilisateur preteur) {
        this.preteur = preteur;
    }

    public Utilisateur getPreteur() {
        return preteur;
    }

    public Utilisateur getEmprunteur() {
        return emprunteur;
    }

    public Livre getLivre() {
        return livre;
    }

    public void setEmprunteur(Utilisateur emprunteur) {
        this.emprunteur = emprunteur;
    }

    public void setLivre(Livre livre) {
        this.livre = livre;
    }

    public String getLivreModelId() {
        return livreModelId;
    }

    public void setLivreModelId(String livreModelId) {
        this.livreModelId = livreModelId;
    }

    public LivreModel getLivreModel() {
        return livreModel;
    }

    public void setLivreModel(LivreModel livreModel) {
        this.livreModel = livreModel;
    }

    //TODO  get direct child with adequate mongoDb query
    public Commentaire getCommentaire(String commId) {
        for(Commentaire comm : this.commentaires) {
            if(comm.getId().equals(commId)){
                return comm;
            }
        }
        return null;
    }
}
