package lea.repository.livre;

import lea.modele.Livre;

import java.util.List;
import java.util.Set;

public interface LivreRepository {

    Livre getLivreDetail(Integer integer);

    Livre saveLivre(Livre livre);

    Livre findOne(String bookId);

    void supprimerLivre(String bookId);

    List<Livre> findAll(Set<String> listLivresId);
}
