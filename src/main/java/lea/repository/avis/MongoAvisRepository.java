package lea.repository.avis;

import lea.modele.Avis;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MongoAvisRepository extends MongoRepository<Avis, String> {

}
