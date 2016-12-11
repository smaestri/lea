package lea.repository.emprunt;

import lea.modele.Commentaire;
import lea.modele.Emprunt;

import java.util.List;
import java.util.Set;

public interface EmpruntRepository {

    List<Emprunt> findEmprunts(String idEmprunt, boolean b);

    Set<Commentaire> getCommentaires(String empruntId);

    List<Emprunt> findPrets(String id, boolean b);

    Emprunt addEmprunt(Emprunt emprunt);

    Emprunt findOne(String empruntId);

    Emprunt updateEmprunt(Emprunt emprunt);
}
