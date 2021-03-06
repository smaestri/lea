package lea.repository.user;

import lea.commun.StatutEmprunt;
import lea.modele.Livre;
import lea.modele.PendingFriend;
import lea.modele.Utilisateur;
import lea.repository.livremodel.MongoLivreModelRepository;
import lea.repository.password.PasswordResetTokenRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class UserRepositoryImpl implements UserRepository {

    @Autowired
    private PasswordResetTokenRepository passwordTokenRepository = null;

    @Autowired
    private MongoUserRepository mongoUserRepository = null;

    @Autowired
    private MongoLivreModelRepository mongoLivreModelRepository = null;

    @Autowired
    private MongoTemplate mongoTemplate = null;

    @Override
    public List<Utilisateur> findAll() {
        return mongoTemplate.findAll(Utilisateur.class);
    }

    @Override
    public Utilisateur saveUser(Utilisateur userDetail) {
        return mongoUserRepository.save(userDetail);
    }

    public void supprimerLivre2(String bookId, String userId) {
        Query q = new Query();
        q.addCriteria(Criteria.where("id").is(new ObjectId(userId)).and("livres.id").is(new ObjectId(bookId)));
        Update update = new Update();
        update.set("livres.$.deleted", true);
        mongoTemplate.updateFirst(q, update, Utilisateur.class);
    }

    @Override
    public void supprimerLivre(String bookId, String userId) {
        Query q = new Query();
        q.addCriteria(Criteria.where("id").is(new ObjectId(userId)).and("livres.id").is(new ObjectId(bookId)));
        Update update = new Update();
        update.pull("livres", Query.query(Criteria.where("id").is(new ObjectId(bookId))));
        mongoTemplate.updateFirst(q, update, Utilisateur.class);

    }

    @Override
    public List<Utilisateur> findFriends(List<String> listFriendsId) {
        Query q = new Query();
        q.addCriteria(Criteria.where("id").in(listFriendsId));
        List<Utilisateur> utilisateurs = mongoTemplate.find(q, Utilisateur.class);
        return utilisateurs;
    }

    @Override
    public void addPendingFriend(Utilisateur user, PendingFriend pf) {
        user.getListPendingFriends().add(pf);
        mongoTemplate.save(user);
    }

    @Override
    public List<Utilisateur> findRequestedFriends(String idPf) {
        Query q = new Query();
        q.addCriteria(Criteria.where("listPendingFriends.email").in(idPf));
        List<Utilisateur> all = mongoTemplate.find(q, Utilisateur.class);
        return all;
    }

    @Override
    public void deleteFriend(String idUserConnected, String friendId) {
        Query q = new Query();
        q.addCriteria(Criteria.where("id").is(new ObjectId(idUserConnected)));
        Update update = new Update();
        update.pull("listFriendsId", friendId);
        mongoTemplate.updateFirst(q, update, Utilisateur.class);
    }

    @Override
    public void deletePendingFriend(Utilisateur userDetail, String idToDelete) {
        Query q = new Query();
        q.addCriteria(Criteria.where("id").is(new ObjectId(userDetail.getId())).and("listPendingFriends.id").is(new ObjectId(idToDelete)));
        Update update = new Update();
        update.pull("listPendingFriends", Query.query(Criteria.where("id").is(new ObjectId(idToDelete))));
        mongoTemplate.updateFirst(q, update, Utilisateur.class);
    }

    @Override
    public Utilisateur findproprietaire(String bookId) {
        Query q = new Query();
        q.addCriteria(Criteria.where("livres.id").is(new ObjectId(bookId)));
        Utilisateur user = mongoTemplate.findOne(q, Utilisateur.class);
        return user;
    }

    @Override
    public PendingFriend findPendingFriend(Utilisateur user, String email) {
        Query q = new Query();
        q.addCriteria(Criteria.where("id").in(new ObjectId(user.getId())));
        Utilisateur userRequested = mongoTemplate.findOne(q, Utilisateur.class);
        for (PendingFriend pf : userRequested.getListPendingFriends()) {
            if (pf.getEmail().equals(email)) {
                return pf;
            }
        }
        return null;
    }

    @Override
    public void updateBookStatus(Utilisateur proprietaire, String livreId, StatutEmprunt statut) {
        Query q = new Query();
        q.addCriteria(Criteria.where("id").is(new ObjectId(proprietaire.getId())).and("livres.id").is(new ObjectId(livreId)));
        Update update = new Update();
        update.set("livres.$.statut", statut);
        mongoTemplate.updateFirst(q, update, Utilisateur.class);
    }




    @Override
    public void saveLivre(Utilisateur user, Livre newLivre) {
        // create
        if (!bookExist(user, newLivre)) {
            user.getLivres().add(newLivre);
            mongoTemplate.save(user);
        }
        //update
//        else {
//            Query q = new Query();
//            q.addCriteria(Criteria.where("id").is(new ObjectId(user.getId())).and("livres.id").is(new ObjectId(newLivre.getId())));
//            Update update = new Update();
//            update.set("livres.$.titreBook", newLivre.getTitreBook());
//            update.set("livres.$.auteur", newLivre.getAuteur());
//            update.set("livres.$.description", newLivre.getDescription());
//            update.set("livres.$.categorieId", newLivre.getCategorieId());
//            update.set("livres.$.editeur", newLivre.getEditeur());
//            update.set("livres.$.image", newLivre.getImage());
//            update.set("livres.$.isbn", newLivre.getIsbn());
//            mongoTemplate.updateFirst(q, update, Utilisateur.class);
//        }
    }

    private boolean bookExist(Utilisateur user, Livre livre) {
        if (livre.getId() == null) {
            return false;
        }

        for (Livre l : user.getLivres()) {
            if (l.getId().equals(livre.getId())) {
                return true;
            }
        }
        return false;
    }



//    private Avis getAvisFromBook(Livre livre, Avis newAvis) {
//        for (Avis avisExiting : livre.getAvis()) {
//            if (avisExiting.getId().equals(newAvis.getId())) {
//                return avisExiting;
//            }
//        }
//        return null;
//    }
}
