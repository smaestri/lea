package lea.controller;

import lea.dto.AvisBean;
import lea.modele.Avis;
import lea.modele.Livre;
import lea.modele.LivreModel;
import lea.modele.Utilisateur;
import lea.repository.livremodel.MongoLivreModelRepository;
import lea.repository.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
public class AvisController extends CommonController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MongoLivreModelRepository mongoLivreModelRepository;

    @RequestMapping(value = "/api/avis/{bookId}", method = RequestMethod.POST)
    @ResponseBody
    public String addAvis(@PathVariable("bookId") String livreId, @RequestBody AvisBean avisBean) throws Exception {
        // retrieve book model
        Optional<LivreModel> byId = this.mongoLivreModelRepository.findById(livreId);
        Avis newAvis = new Avis();
        if (byId.isPresent()) {
            Utilisateur auteurAvis = this.getPrincipal();
            newAvis.setNote(avisBean.getNote());
            newAvis.setLibelle(avisBean.getLibelle());
            newAvis.setAuteur(auteurAvis.getId());
            newAvis.setDateavis(new Date());
            LivreModel livremodel = byId.get();
            livremodel.getAvis().add(newAvis);
            this.mongoLivreModelRepository.save(livremodel);
        }
        return newAvis.getId();
    }


    // Editer un avis : PUT
    @RequestMapping(value = "/api/avis/{avisId}/{bookId}", method = RequestMethod.PUT)
    public String editAvis(@PathVariable("avisId") String avisId,
                           @PathVariable("bookId") String bookModelId,
                           @RequestBody AvisBean avisBean) {

        LivreModel livreModel = this.mongoLivreModelRepository.findById(bookModelId).get();
        Optional <Avis> optAvis = livreModel.getAvis().stream()
                .filter(currentAvis -> currentAvis.getId().equals(avisId))
                .findFirst();
        if(optAvis.isPresent()) {
            Avis avis = optAvis.get();
            avis.setLibelle(avisBean.getLibelle());
            avis.setNote(avisBean.getNote());
            avis.setDateavis(new Date());
        }

        this.mongoLivreModelRepository.save(livreModel);
        return avisId;
    }

    @RequestMapping(value = "/api/avis/{avisId}", method = RequestMethod.DELETE)
    @ResponseBody
    public Livre deleteAvis(@PathVariable("avisId") String avisId) throws Exception {
        userRepository.deleteAvis(avisId);
        return null;
    }

    @RequestMapping(value = "/api/getLastAvis", method = RequestMethod.GET)
    @ResponseBody
    public List<Avis> getLast() throws Exception {
        return userRepository.findlastAvis();
    }

}