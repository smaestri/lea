package lea.repository.categorie;

import lea.modele.Categorie;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MongoCategorieRepository extends MongoRepository<Categorie, String> {

}
