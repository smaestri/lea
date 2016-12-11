package lea.repository.categorie;


import lea.modele.Categorie;

import java.util.List;

public interface CategorieRepository {

    List<Categorie> findAll();

    Categorie findOne(String categorieId);


}
