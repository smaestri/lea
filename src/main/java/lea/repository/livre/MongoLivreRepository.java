package lea.repository.livre;

import lea.modele.Livre;
import org.springframework.data.mongodb.repository.MongoRepository;

/**
 * Created by sylvain on 11/12/16.
 */
public interface MongoLivreRepository extends MongoRepository<Livre, String> {

}
