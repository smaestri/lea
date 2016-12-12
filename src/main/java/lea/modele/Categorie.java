package lea.modele;

public class Categorie extends BaseDocumentImpl{

    private String libelleCat;

    public String getLibelleCat() {
        return libelleCat;
    }

    public void setLibelleCat(String libelleCat) {
        this.libelleCat = libelleCat;
    }

    @Override
    public String toString() {
        return "Categorie{" +
                "libelleCat='" + libelleCat + '\'' +
                '}';
    }
}
