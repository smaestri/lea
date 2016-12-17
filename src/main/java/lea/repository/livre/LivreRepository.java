package lea.repository.livre;

import lea.modele.Livre;

import java.util.List;
import java.util.Set;

public interface LivreRepository {

    Livre findOne(String bookId);

    List<Livre> findAll(Set<String> listLivresId);
}
