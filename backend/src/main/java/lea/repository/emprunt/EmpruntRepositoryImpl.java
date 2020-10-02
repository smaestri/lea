package lea.repository.emprunt;

import lea.modele.Commentaire;
import lea.modele.Emprunt;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class EmpruntRepositoryImpl implements EmpruntRepository {

    @Autowired
    private MongoEmpruntRepository mongoEmpruntRepository;

    @Autowired
    private MongoTemplate mongoTemplate;

    @Override
    public Emprunt findEmpruntFromCommentid(String idComment) {
        Query q = new Query();
        q.addCriteria(Criteria.where("commentaires.id").is(new ObjectId(idComment)));
        Emprunt emp = mongoTemplate.findOne(q, Emprunt.class);
        return emp;
    }

    @Override
    public List<Commentaire> getCommentaires(String empruntId) {
        Emprunt one = mongoEmpruntRepository.findById(empruntId).get();
        return one.getCommentaires();
    }

    @Override
    public Emprunt saveEmprunt(Emprunt emprunt) {
        Emprunt newEmprunt = mongoEmpruntRepository.save(emprunt);
        return newEmprunt;
    }

    @Override
    public Emprunt findOne(String empruntId) {
        return mongoEmpruntRepository.findById(empruntId).get();
    }

    @Override
    public List<Emprunt> findAllEmprunts(List<String> listEmpruntId) {
        Criteria criteria = Criteria.where("id").in(listEmpruntId);
        Query query = new Query(criteria);
        return mongoTemplate.find(query, Emprunt.class);
    }

    @Override
    public Commentaire findComment(String commentId) {
        Emprunt emp = this.findEmpruntFromCommentid(commentId);
        return emp.getCommentaire(commentId);
    }

    @Override
    public void saveEditComment(Commentaire comment) {
        // Edit comment => id always supplied
        Query q = new Query();
        q.addCriteria(Criteria.where("commentaires.id").is(new ObjectId(comment.getId())));
        Update update = new Update();
        update.set("commentaires.$.message", comment.getMessage());
        update.set("commentaires.$.dateMessage", comment.getDateMessage());
        mongoTemplate.updateFirst(q, update, Emprunt.class);
    }

    @Override
    public void deleteComment(String commentId, String empruntId) {
        Query q = new Query();
        q.addCriteria(Criteria.where("id").is(new ObjectId(empruntId)).and("commentaires.id").is(new ObjectId(commentId)));
        Update update = new Update();
        update.pull("commentaires", Query.query(Criteria.where("id").is(new ObjectId(commentId))));
        mongoTemplate.updateFirst(q, update, Emprunt.class);

    }

    public Emprunt findEmpruntFromBook(String bookId) {
        Criteria criteria = Criteria.where("livreId").in(bookId).and("actif").is(true);
        Query query = new Query(criteria);
        List<Emprunt> emprunts = mongoTemplate.find(query, Emprunt.class);
        if (emprunts != null && emprunts.size() > 0) {
            return emprunts.get(0);
        }
        return null;
    }
}
