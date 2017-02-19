package lea.modele;

public class Categorie extends BaseDocumentImpl{

    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "Categorie{" +
                "name='" + name + '\'' +
                '}';
    }
}
