package lea.modele;

import java.io.Serializable;
import java.util.Date;
import java.util.Set;

public class Emprunt extends BaseDocumentImpl implements Serializable {

    // FOREIGN KEYS
    private String emprunteurId;
    private String preteurId;
    private String livreId;
    private Set<String> listeCommentaireid;

    private Date debutEmprunt;
    private Date finEmprunt;
    private boolean actif;
    private Date dateDemande;

    private String motifRefus;
    private String intermediaire;

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

    public Set<String> getListeCommentaireid() {
        return listeCommentaireid;
    }

    public void setListeCommentaireid(Set<String> listeCommentaireid) {
        this.listeCommentaireid = listeCommentaireid;
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

    @Override
    public String toString() {
        return "Emprunt{" +
                "emprunteurId='" + emprunteurId + '\'' +
                ", preteurId='" + preteurId + '\'' +
                ", livreId='" + livreId + '\'' +
                ", listeCommentaireid=" + listeCommentaireid +
                ", debutEmprunt=" + debutEmprunt +
                ", finEmprunt=" + finEmprunt +
                ", actif=" + actif +
                ", dateDemande=" + dateDemande +
                ", motifRefus='" + motifRefus + '\'' +
                ", intermediaire='" + intermediaire + '\'' +
                '}';
    }
}
