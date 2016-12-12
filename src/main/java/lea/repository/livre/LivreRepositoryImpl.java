package lea.repository.livre;

import lea.modele.Livre;
import lea.modele.PendingFriend;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
class LivreRepositoryImpl implements LivreRepository {

    @Autowired
    private MongoLivreRepository mongoLivreRepository = null;

    @Autowired
    private MongoTemplate mongoTemplate = null;

    @Override
    public Livre getLivreDetail(Integer integer) {
        return null;
    }

    @Override
    public Livre saveLivre(Livre livre) {
        return mongoLivreRepository.save(livre);

    }

    @Override
    public Livre findOne(String bookId) {
        return mongoLivreRepository.findOne(bookId);
    }

    @Override
    public void supprimerLivre(String bookId) {
        Criteria criteria = Criteria.where("id").in(bookId);
        Query query = new Query(criteria);
        mongoTemplate.remove(query, Livre.class);

    }

    @Override
    public List<Livre> findAll(Set<String> listLivresId) {
        Criteria criteria = Criteria.where("id").in(listLivresId);
        Query query = new Query(criteria);
        List<Livre> livres = mongoTemplate.find(query, Livre.class);
        return livres;
    }
}
