package lea.repository.avis;

import lea.modele.Avis;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class AvisRepositoryImpl implements AvisRepository {

    @Autowired
    private MongoAvisRepository mongoAvisRepository;

    @Override
    public List<Avis> getLastAvis() {
        //TODO get last
        return mongoAvisRepository.findAll();
    }

    @Override
    public Avis save(Avis avis) {
        Avis save = mongoAvisRepository.save(avis);
        return save;

    }
}
