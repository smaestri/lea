package lea.dto;

/**
 * Created by sylvain on 28/03/16.
 */
public class EmpruntBean {

    private String idLivre;

    //private String idProprietaire;
    private String txtRencontre;
    private String mode;
    private String idIntermediaire;

    public String getIdLivre() {
        return idLivre;
    }

    public void setIdLivre(String idLivre) {
        this.idLivre = idLivre;

    }

    public String getIdIntermediaire() {
        return idIntermediaire;
    }

    public void setIdIntermediaire(String idIntermediaire) {
        this.idIntermediaire = idIntermediaire;
    }

    public String getTxtRencontre() {
        return txtRencontre;
    }

    public void setTxtRencontre(String txtRencontre) {
        this.txtRencontre = txtRencontre;
    }

    public String getMode() {
        return mode;
    }

    public void setMode(String mode) {
        this.mode = mode;
    }
}