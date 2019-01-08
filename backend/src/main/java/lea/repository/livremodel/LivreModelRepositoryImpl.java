package lea.repository.livremodel;

import lea.modele.LivreModel;
import lea.modele.Utilisateur;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class LivreModelRepositoryImpl implements LivreModelRepository {

    @Autowired
    private MongoTemplate mongoTemplate = null;

    @Override
    public void deleteAvis(String idAvis) {
        Query q = new Query();
        q.addCriteria(Criteria.where("avis.id").is(new ObjectId(idAvis)));
        Update update = new Update();
        update.pull("$.avis", Query.query(Criteria.where("id").is(new ObjectId(idAvis))));
        mongoTemplate.updateFirst(q, update, Utilisateur.class);
    }

    @Override
    public List<LivreModel> findByLastAvis() {
        Query q = new Query();
        q.limit(100);
        q.with(new Sort(Sort.Direction.DESC, "avis.dateavis"));
        List<LivreModel> lms = mongoTemplate.find(q, LivreModel.class);
        return lms;
    }

}
