package lea.repository.emprunt;

import lea.modele.Commentaire;
import lea.modele.Emprunt;

import java.util.List;

public interface EmpruntRepository {

    List<Emprunt> findEmprunts(String idUser, boolean b);

    Emprunt findEmpruntFromCommentid(String idComment);

    List<Commentaire> getCommentaires(String empruntId);

    List<Emprunt> findPrets(String id, boolean b);

    Emprunt saveEmprunt(Emprunt emprunt);

    Emprunt findOne(String empruntId);

    List<Emprunt> findAllEmprunts(List<String> listPretsId);

    Commentaire findComment(String commentId);

    void saveEditComment(Commentaire comment);

    void deleteComment(String commentId, String empruntId);

    Emprunt findEmpruntFromBook(String bookId);
}
