package lea.controller;

import lea.modele.*;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
public class AvisController extends CommonController {

    @RequestMapping(value = "/api/avis/{bookId}", method = RequestMethod.POST)
    @ResponseBody
    public String addAvis(@PathVariable("bookId") String livreId, @RequestBody Avis avis) throws Exception {
        Utilisateur proprietaire = userRepository.findproprietaire(livreId);
        Utilisateur auteurAvis = this.getPrincipal();
        avis.setAuteur(auteurAvis.getId());
        avis.setDateavis(new Date());
        userRepository.saveAvis(proprietaire, livreId, avis);
        return avis.getId();
    }

    // Editer un avis : PUT
    @RequestMapping(value = "/api/avis/{avisId}", method = RequestMethod.PUT)
    public String editAvis(@PathVariable("avisId") String avisId, @RequestBody Avis avis) {
        avis.setDateavis(new Date());
        userRepository.updateAvis(avisId, avis);
        return "OK";
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