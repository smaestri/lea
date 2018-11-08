package lea.repository.livremodel;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class LivreModelRepositoryImpl implements LivreModelRepository {

    @Autowired
    private MongoLivreModelRepository mongoCategorieRepository;

}
