package lea.repository.emprunt;

import lea.modele.Emprunt;
import org.springframework.data.mongodb.repository.MongoRepository;

/**
 * Created by sylvain on 11/12/16.
 */
public interface MongoEmpruntRepository extends MongoRepository<Emprunt, String> {

}
