package lea.repository.livre;

import lea.modele.Livre;

public interface LivreRepository {

    Livre getLivreDetail(Integer integer);

    Livre saveLivre(Livre livre);

    Livre findOne(String bookId);

    void supprimerLivre(String bookId);
}
