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
    private MongoEmpruntRepository mongoEmpruntRepository = null;

    @Autowired
    private MongoTemplate mongoTemplate = null;

    @Override
    public List<Emprunt> findEmprunts(String idUser, boolean actif) {
        Criteria criteria = Criteria.where("actif").in(actif).and("emprunteur.id").is(idUser);
        Query query = new Query(criteria);
        return mongoTemplate.find(query, Emprunt.class);
    }

    @Override
    public Set<Commentaire> getCommentaires(String empruntId) {
        Emprunt one = mongoEmpruntRepository.findOne(empruntId);
        return one.getListeCommentaire();
    }

    @Override
    public List<Emprunt> findPrets(String idUser, boolean actif) {
        Criteria criteria = Criteria.where("actif").in(actif).and("preteur.id").is(idUser);
        Query query = new Query(criteria);
        return mongoTemplate.find(query, Emprunt.class);
    }

    @Override
    public Emprunt addEmprunt(Emprunt emprunt) {
        Emprunt newEmprunt = mongoEmpruntRepository.save(emprunt);
        return newEmprunt;

    }

    @Override
    public Emprunt findOne(String empruntId) {
        return mongoEmpruntRepository.findOne(empruntId);
    }

    @Override
    public Emprunt updateEmprunt(Emprunt emprunt) {
        Emprunt emp = mongoEmpruntRepository.save(emprunt);
        return emp;

    }
}
