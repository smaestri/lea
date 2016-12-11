package lea.repository.commentaire;

import lea.modele.Commentaire;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MongoCommentaireRepository extends MongoRepository<Commentaire, String> {

}
