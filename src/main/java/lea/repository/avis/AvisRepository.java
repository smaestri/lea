package lea.repository.avis;

import lea.modele.Avis;

import java.util.List;

public interface AvisRepository {

    List<Avis> getLastAvis();

    Avis save(Avis avis);
}
