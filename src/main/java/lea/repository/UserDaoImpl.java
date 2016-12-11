//package lea.repository;
//
//import java.util.ArrayList;
//import java.util.List;
//import java.util.Set;
//
//import javax.persistence.EntityManager;
//
//import lea.modele.PendingFriend;
//import lea.modele.UserProfile;
//import lea.modele.Utilisateur;
//
//import org.hibernate.Criteria;
//import org.hibernate.FetchMode;
//import org.hibernate.SessionFactory;
//import org.hibernate.criterion.MatchMode;
//import org.hibernate.criterion.Restrictions;
//import org.hibernate.sql.JoinType;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Repository;
//import org.hibernate.Session;
//
//@Repository
//@SuppressWarnings("unchecked")
//public class UserDaoImpl implements UserDao {
//
//	@Autowired
//	 private EntityManager em;
//
//	@Override
//	public Utilisateur findUsers(Integer idUser) {
//        Criteria criteria = ((Session) em.getDelegate()).createCriteria(Utilisateur.class);
//        criteria.add(Restrictions.eq("id", idUser));
//        criteria.setFetchMode("userFriends", FetchMode.JOIN);
//		return (Utilisateur) criteria.uniqueResult();
//	}
//
//	@Override
//	public List<Utilisateur> findByEmail(String email) {
//		Criteria c = ((Session) em.getDelegate()).createCriteria(Utilisateur.class)/*.setFetchMode("livres", FetchMode.JOIN)*/;
//		c.setFetchMode("userFriends", FetchMode.JOIN);
//		c.add(Restrictions.ilike("email", email, MatchMode.ANYWHERE));
//		return c.list();
//	}
//
//	@Override
//	public List<Utilisateur> findByName(String login) {
//		Criteria c = ((Session) em.getDelegate()).createCriteria(Utilisateur.class)/*.setFetchMode("livres", FetchMode.JOIN)*/;
//		c.add(Restrictions.ilike("login", login, MatchMode.ANYWHERE));
//		return c.list();
//	}
//
//	@Override
//	public Utilisateur getUserDetail(Integer userDetail) {
//		Criteria c = ((Session) em.getDelegate()).createCriteria(Utilisateur.class);
//		c.setFetchMode("livres", FetchMode.JOIN);
//		c.setFetchMode("emprunts", FetchMode.JOIN);
//		c.setFetchMode("prets", FetchMode.JOIN);
//        c.setFetchMode("userFriends", FetchMode.JOIN);
//		c.createAlias("livres.categorie","categorie", JoinType.LEFT_OUTER_JOIN);
//		c.setFetchMode("emailUsers", FetchMode.JOIN);
//		c.setFetchMode("userProfiles",  FetchMode.JOIN);
//		c.add(Restrictions.eq("id", userDetail));
//		Utilisateur user = (Utilisateur) c.uniqueResult();
//		return user;
//	}
//
//    @Override
//    public Utilisateur getUserDetailWithFriendBooks(Integer friendId, Integer idUserConnected) {
//        Criteria c = ((Session) em.getDelegate()).createCriteria(Utilisateur.class);
//        c.setFetchMode("livres", FetchMode.JOIN);
//        c.createAlias("userFriends","userFriends", JoinType.LEFT_OUTER_JOIN);
//        c.createAlias("userFriends.livres", "livres", JoinType.LEFT_OUTER_JOIN);
//        c.add(Restrictions.eq("id", friendId));
//        Utilisateur user = (Utilisateur) c.uniqueResult();
//        return user;
//    }
//
//    @Override
//	public Utilisateur ajouterUser(Utilisateur user) {
//		((Session) em.getDelegate()).saveOrUpdate(user);
//		return user;
//	}
//
//	@Override
//	public boolean isFriend(int idUser1, int idUser2) {
//
//		//Fetch in one way
//		Utilisateur user = (Utilisateur) ((Session) em.getDelegate()).load(Utilisateur.class, idUser1);
//		Set<Utilisateur> userFriends = user.getUserFriends();
//
//		if (!fetchFriend(userFriends, idUser2)){
//			//Fetch other way
//			Utilisateur user2 = (Utilisateur) ((Session) em.getDelegate()).load(Utilisateur.class, idUser2);
//			Set<Utilisateur> userFriends2 = user2.getUserFriends();
//			return fetchFriend(userFriends2, idUser1);
//		}
//		return true;
//	}
//
//	@Override
//	public UserProfile getProfileUser(){
//		Criteria c = ((Session) em.getDelegate()).createCriteria(UserProfile.class);
//		c.add(Restrictions.ilike("type", "USER"));
//		return (UserProfile) c.uniqueResult();
//	}
//
//	@Override
//	public PendingFriend addPendingFriend(PendingFriend emailuser) {
//		((Session) em.getDelegate()).saveOrUpdate(emailuser);
//		return emailuser;
//	}
//
//    /**
//     * Look for requested friends of a user by his e-mail (requested friends have subscribed)
//     * @param mail
//     * @return
//     */
//	@Override
//	public List<Utilisateur> findRequestedFriends(String mail) {
//		Criteria c = ((Session) em.getDelegate()).createCriteria(PendingFriend.class);
//		c.add(Restrictions.ilike("email", mail));
//		c.setFetchMode("utilisateur", FetchMode.JOIN);
//        c.add(Restrictions.eq("actif", true));
//        //c.setFetchMode("utilisateur.livres", FetchMode.JOIN);
//
//		List<PendingFriend> emailUsers = c.list();
//		List<Utilisateur> utilisateurs = new ArrayList<Utilisateur>();
//
//		for (PendingFriend mailUser : emailUsers){
//			utilisateurs.add(mailUser.getUtilisateur());
//		}
//
//		return utilisateurs;
//
//	}
//
//    // Get user pending friends
//    @Override
//    public List<PendingFriend> findPendingFriends(Integer idUser) {
//        Criteria c = ((Session) em.getDelegate()).createCriteria(PendingFriend.class);
//        // c.add(Restrictions.ilike("email", mail));
//        c.setFetchMode("utilisateur", FetchMode.JOIN);
//        c.add(Restrictions.eq("utilisateur.id", idUser));
//        c.add(Restrictions.eq("actif", true));
//        return c.list();
//
//    }
//
//	@Override
//	public void desactivatePendingFriend(PendingFriend emailUser) {
//		emailUser.setActif(false);
//		((Session) em.getDelegate()).saveOrUpdate(emailUser);
//	}
//
//	@Override
//	public Utilisateur findIntermediaire(Utilisateur userSource, int userToFind) {
//		for(Utilisateur user : userSource.getUserFriends()){
//			Utilisateur userDetail = this.getUserDetail(user.getId());
//			for(Utilisateur subFriend : userDetail.getUserFriends()){
//				if(userToFind == subFriend.getId()){
//					return userDetail;
//				}
//			}
//		}
//		return null;
//	}
//
//	private boolean fetchFriend(Set<Utilisateur> userFriends, int idUser ){
//		for (Utilisateur u : userFriends){
//			if (u.getId() == idUser){
//				return true;
//			}
//		}
//		return false;
//	}
//}
