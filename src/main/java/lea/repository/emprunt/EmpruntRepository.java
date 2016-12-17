package lea.repository.emprunt;

import lea.modele.Commentaire;
import lea.modele.Emprunt;

import java.util.List;
import java.util.Set;

public interface EmpruntRepository {

    List<Emprunt> findEmprunts(String idUser, boolean b);

    List<Commentaire> getCommentaires(String empruntId);

    List<Emprunt> findPrets(String id, boolean b);

    Emprunt saveEmprunt(Emprunt emprunt);

    Emprunt findOne(String empruntId);

    List<Emprunt> findAllEmprunts(List<String> listPretsId);
}
