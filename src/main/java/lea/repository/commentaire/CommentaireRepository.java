package lea.repository.commentaire;

import lea.modele.Commentaire;

import java.util.List;

public interface CommentaireRepository {

    Commentaire save(Commentaire comm);

    Commentaire findOne(String comId);

    List<Commentaire> findAll(List<String> commentsid);
}
