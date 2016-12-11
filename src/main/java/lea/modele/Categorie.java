package lea.modele;

import org.springframework.data.annotation.Id;

public class Categorie {

    @Id
    protected String id;

    private String libelleCat;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getLibelleCat() {
        return libelleCat;
    }

    public void setLibelleCat(String libelleCat) {
        this.libelleCat = libelleCat;
    }

}
