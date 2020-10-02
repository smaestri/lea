package lea.repository.emprunt;

import lea.modele.Emprunt;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

/**
 * Created by sylvain on 11/12/16.
 */
public interface MongoEmpruntRepository extends MongoRepository<Emprunt, String> {

    List<Emprunt> findByEmprunteurId(String id, Sort sort);
    List<Emprunt> findByPreteurId(String id, Sort sort);

}
