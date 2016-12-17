package lea.repository.commentaire;

import lea.modele.Commentaire;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class CommentaireRepositoryImpl implements CommentaireRepository {

    @Autowired
    private MongoCommentaireRepository mongoCommentaireRepository;

    @Autowired
    private MongoTemplate mongoTemplate;

    @Override
    public Commentaire save(Commentaire comm) {
        return mongoCommentaireRepository.save(comm);
    }

    @Override
    public Commentaire findOne(String comId) {
        return mongoCommentaireRepository.findOne(comId);
    }

    @Override
    public List<Commentaire> findAll(List<String> commentsid) {
        Criteria criteria = Criteria.where("id").in(commentsid);
        Query query = new Query(criteria);
        return mongoTemplate.find(query, Commentaire.class);
    }
}
