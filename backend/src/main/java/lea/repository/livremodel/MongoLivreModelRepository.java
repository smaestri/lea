package lea.repository.livremodel;

import lea.modele.LivreModel;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MongoLivreModelRepository extends MongoRepository<LivreModel, String> {

    LivreModel findByIsbn10(String isbn);
    LivreModel findByIsbn13(String isbn);

}
