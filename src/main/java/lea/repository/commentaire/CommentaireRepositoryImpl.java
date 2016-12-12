package lea.repository.commentaire;

import lea.modele.Commentaire;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class CommentaireRepositoryImpl implements CommentaireRepository {

    @Autowired
    private MongoCommentaireRepository mongoCommentaireRepository;

    @Override
    public Commentaire save(Commentaire comm) {
        return mongoCommentaireRepository.save(comm);
    }

    @Override
    public Commentaire findOne(String comId) {
        return mongoCommentaireRepository.findOne(comId);
    }
}
