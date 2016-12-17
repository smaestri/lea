package lea.repository.emprunt;

import lea.modele.Commentaire;
import lea.modele.Emprunt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public class EmpruntRepositoryImpl implements EmpruntRepository {

    @Autowired
    private MongoEmpruntRepository mongoEmpruntRepository;

    @Autowired
    private MongoTemplate mongoTemplate;

    @Override
    public List<Emprunt> findEmprunts(String idUser, boolean actif) {
        Criteria criteria = Criteria.where("actif").in(actif).and("emprunteurId").is(idUser);
        Query query = new Query(criteria);
        return mongoTemplate.find(query, Emprunt.class);
    }

    @Override
    public List<Commentaire> getCommentaires(String empruntId) {
        Emprunt one = mongoEmpruntRepository.findOne(empruntId);
        return one.getCommentaires();
    }

    @Override
    public List<Emprunt> findPrets(String idUser, boolean actif) {
        Criteria criteria = Criteria.where("actif").in(actif).and("preteurId").is(idUser);
        Query query = new Query(criteria);
        return mongoTemplate.find(query, Emprunt.class);
    }

    @Override
    public Emprunt saveEmprunt(Emprunt emprunt) {
        Emprunt newEmprunt = mongoEmpruntRepository.save(emprunt);
        return newEmprunt;
    }

    @Override
    public Emprunt findOne(String empruntId) {
        return mongoEmpruntRepository.findOne(empruntId);
    }

    @Override
    public List<Emprunt> findAllEmprunts(List<String> listEmpruntId) {
        Criteria criteria = Criteria.where("id").in(listEmpruntId);
        Query query = new Query(criteria);
        return mongoTemplate.find(query, Emprunt.class);
    }
}
