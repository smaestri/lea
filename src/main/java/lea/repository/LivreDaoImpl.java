//package lea.repository;
//
//import java.util.List;
//import java.util.Set;
//
//import javax.persistence.EntityManager;
//
//import lea.modele.Avis;
//import lea.modele.Categorie;
//import lea.modele.Livre;
//import lea.modele.Utilisateur;
//
//import org.hibernate.Criteria;
//import org.hibernate.FetchMode;
//import org.hibernate.Session;
//import org.hibernate.SessionFactory;
//import org.hibernate.criterion.MatchMode;
//import org.hibernate.criterion.Restrictions;
//import org.hibernate.sql.JoinType;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Repository;
//
//import lea.commun.StatutEmprunt;
//
//@SuppressWarnings("unchecked")
//@Repository
//public class LivreDaoImpl implements LivreDao {
//
//	@Autowired
//	 private EntityManager em;
//
//	/**
//	 * Afficher les livres d'un utilisateur
//	 */
//	public Set<Livre> rechercherLivres(Integer idUser) {
//		Criteria c = ((Session) em.getDelegate()).createCriteria(Utilisateur.class);//.createCriteria("categorie"))//
//		c.setFetchMode("livres", FetchMode.JOIN);
//		c.setFetchMode("prets", FetchMode.JOIN);
//		c.add(Restrictions.eq("id", idUser));
//		Utilisateur user = (Utilisateur) c.uniqueResult();
//
//		return user.getLivres();
//
//	}
//
//	public Livre ajouterLivre(Livre livre) {
//		livre.setStatut(StatutEmprunt.FREE);
//		((Session) em.getDelegate()).saveOrUpdate(livre);
//		return livre;
//	}
//
//	public Categorie getCategorie(Integer idCat){
//
//		return (Categorie) ((Session) em.getDelegate()).get(Categorie.class, idCat);
//
//	}
//
//	public Livre getLivreDetail(int idLivre) {
//		Criteria c = ((Session) em.getDelegate()).createCriteria(Livre.class);
//		c.add(Restrictions.eq("id", idLivre));
//		c.createAlias("user", "user");
//		//c.createAlias("avis.auteur", "auteur");
//		c.setFetchMode("avis.auteur",  FetchMode.JOIN);
//
//        c.createAlias("categorie", "categorie");
//		c.setFetchMode("avis", FetchMode.JOIN);
//		//c.createAlias("avis", "avis");
//		return (Livre) c.uniqueResult();
//
//	}
//
//	@Override
//	public List<Categorie> getAllCategorie() {
//		return ((Session) em.getDelegate()).createCriteria(Categorie.class).list();
//	}
//
//	@Override
//	public Livre majStatut(Integer idLivre, StatutEmprunt statutEmprunt) {
//		Livre livre = (Livre) ((Session) em.getDelegate()).get(Livre.class, idLivre);
//		livre.setStatut(statutEmprunt);
//		((Session) em.getDelegate()).saveOrUpdate(livre);
//		return livre;
//	}
//
//	@Override
//	public void supprimerLivre(int idLivre) {
//		Livre livre = (Livre) ((Session) em.getDelegate()).get(Livre.class, idLivre);
//		((Session) em.getDelegate()).delete(livre);
//	}
//
//	@Override
//	public void saveOrUpdate(Livre livre) {
//		((Session) em.getDelegate()).saveOrUpdate(livre);
//	}
//
//	@Override
//	public void ajouterAvis(Avis avis) {
//		((Session) em.getDelegate()).saveOrUpdate(avis);
//	}
//
//	@Override
//	public List<Avis> getAvis() {
//		return ((Session) em.getDelegate()).createCriteria(Avis.class).
//				setFetchMode("livre", FetchMode.JOIN).
//				setFetchMode("auteur", FetchMode.JOIN).list();
//	}
//}
