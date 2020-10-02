package lea.repository.emprunt;

import lea.modele.Commentaire;
import lea.modele.Emprunt;

import java.util.List;

public interface EmpruntRepository {

    Emprunt findEmpruntFromCommentid(String idComment);

    List<Commentaire> getCommentaires(String empruntId);

    Emprunt saveEmprunt(Emprunt emprunt);

    Emprunt findOne(String empruntId);

    List<Emprunt> findAllEmprunts(List<String> listPretsId);

    Commentaire findComment(String commentId);

    void saveEditComment(Commentaire comment);

    void deleteComment(String commentId, String empruntId);

    Emprunt findEmpruntFromBook(String bookId);
}
