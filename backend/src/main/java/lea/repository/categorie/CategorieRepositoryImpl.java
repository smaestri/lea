package lea.repository.categorie;

import lea.modele.Categorie;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class CategorieRepositoryImpl implements CategorieRepository {

    @Autowired
    private MongoCategorieRepository mongoCategorieRepository;

    @Override
    public List<Categorie> findAll() {
        return mongoCategorieRepository.findAll();
    }

    @Override
    public Categorie findOne(String categorieId) {
        return mongoCategorieRepository.findById(categorieId).get();
    }
}
