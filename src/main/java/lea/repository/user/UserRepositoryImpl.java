package lea.repository.user;

import lea.commun.StatutEmprunt;
import lea.modele.*;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public class UserRepositoryImpl implements UserRepository {

    @Autowired
    private MongoUserRepository mongoUserRepository = null;

    @Autowired
    private MongoTemplate mongoTemplate = null;

    @Override
    public List<Utilisateur> findByEmail(String email) {
        Criteria criteria = Criteria.where("email").in(email);
        Query query = new Query(criteria);
        return mongoTemplate.find(query, Utilisateur.class);
    }

    @Override
    public Utilisateur findOne(String id) {
        return mongoUserRepository.findOne(id);
    }

    @Override
    public boolean isFriend(Integer integer, Integer integer1) {
        return false;
    }

    @Override
    public Utilisateur findIntermediaire(Utilisateur userSource, String id) {
        return null;
    }

    @Override
    public Utilisateur saveUser(Utilisateur userDetail) {
        return mongoUserRepository.save(userDetail);
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
    public void addPendingFriend(Utilisateur user, String emailFriend) {
        user.getListPendingFriends().add(emailFriend);
        mongoTemplate.save(user);
    }

    @Override
    public List<Utilisateur> findRequestedFriends(String email) {
        Query q = new Query();
        q.addCriteria(Criteria.where("listPendingFriends").in(email));
        List<Utilisateur> all = mongoTemplate.find(q, Utilisateur.class);
        return all;
    }

    @Override
    public void deletePendingFriend(Utilisateur userDetail, String pendingEmail) {
        Query q = new Query();
        q.addCriteria(Criteria.where("id").is(new ObjectId(userDetail.getId())));
        Update update = new Update();
        update.pull("listPendingFriends", pendingEmail);
        mongoTemplate.updateFirst(q, update, Utilisateur.class);
    }

    @Override
    public Livre findBook(String bookId) {
        Query q = new Query();
        q.addCriteria(Criteria.where("livres.id").is(new ObjectId(bookId)));
        Utilisateur user = mongoTemplate.findOne(q, Utilisateur.class);

        if(user != null){
            Livre livre = user.getLivre(bookId);
            livre.setUserId(user.getId());
            return livre;
        }

        return null;
    }

    @Override
    public Utilisateur findproprietaire(String bookId) {
        Query q = new Query();
        q.addCriteria(Criteria.where("livres.id").is(new ObjectId(bookId)));
        Utilisateur user = mongoTemplate.findOne(q, Utilisateur.class);
        return user;
    }

    @Override
    public Avis findAvis(String avisId) {
        Query q = new Query();
        q.addCriteria(Criteria.where("livres.avis.id").is(new ObjectId(avisId)));
        Utilisateur user = mongoTemplate.findOne(q, Utilisateur.class);
        Avis avis = user.getAvis(avisId);
        return avis;
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
    public void updateAvis(String avisId, Avis avis) {
        Query q = new Query();
        q.addCriteria(Criteria.where("livres.avis.id").is(new ObjectId(avisId)));
        Update update = new Update();
        update.set("livres.$.avis.0.note", avis.getNote());
        update.set("livres.$.avis.0.libelle", avis.getLibelle());
        //update.set("livres.0.avis.0.auteur", avis.getAuteur());

        mongoTemplate.updateFirst(q, update, Utilisateur.class);
    }

    @Override
    public void saveAvis(Utilisateur user,String idLivre, Avis newAvis) {
        Query q = new Query();
        q.addCriteria(Criteria.where("livres.id").is(new ObjectId(idLivre)));
        user.getLivre(idLivre).getAvis().add(newAvis);
        mongoTemplate.save(user);
    }

    @Override
    public void deleteAvis(String idAvis) {
        Query q = new Query();
        q.addCriteria(Criteria.where("livres.avis.id").is(new ObjectId(idAvis)));
        Update update = new Update();
        update.pull("livres.$.avis", Query.query(Criteria.where("id").is(new ObjectId(idAvis))));
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
        else {
            Query q = new Query();
            q.addCriteria(Criteria.where("id").is(new ObjectId(user.getId())).and("livres.id").is(new ObjectId(newLivre.getId())));
            Update update = new Update();
            update.set("livres.$.titreBook", newLivre.getTitreBook());
            update.set("livres.$.auteur", newLivre.getAuteur());
            update.set("livres.$.description", newLivre.getDescription());
            update.set("livres.$.categorieId", newLivre.getCategorieId());
            update.set("livres.$.editeur", newLivre.getEditeur());
            update.set("livres.$.image", newLivre.getImage());
            update.set("livres.$.isbn", newLivre.getIsbn());
            mongoTemplate.updateFirst(q, update, Utilisateur.class);
        }
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

    private Avis getAvisFromBook(Livre livre, Avis newAvis) {
        for (Avis avisExiting : livre.getAvis()) {
            if (avisExiting.getId().equals(newAvis.getId())) {
                return avisExiting;
            }
        }
        return null;
    }

//    private boolean avisExist(Livre livre, Avis avis) {
//
//        if(avis.getId() == null){
//            return false;
//        }
//
//        for(Avis avisExiting: livre.getAvis()) {
//            if (avisExiting.getId().equals(avis.getId())) {
//                return true;
//            }
//        }
//
//        return false;
//    }

}
