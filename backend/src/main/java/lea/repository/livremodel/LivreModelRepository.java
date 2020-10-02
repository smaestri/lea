package lea.repository.livremodel;

import lea.modele.LivreModel;

import java.util.List;

public interface LivreModelRepository {


    void deleteAvis(String livreModelId, String idAvis);

    List<LivreModel> findByLastAvis();
}
