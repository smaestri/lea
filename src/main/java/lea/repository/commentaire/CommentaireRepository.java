package lea.repository.commentaire;

import lea.modele.Commentaire;

public interface CommentaireRepository {

    Commentaire save(Commentaire comm);

    Commentaire findOne(String comId);
}
