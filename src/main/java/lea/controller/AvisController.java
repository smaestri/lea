package lea.controller;

import lea.modele.*;
import org.springframework.web.bind.annotation.*;

@RestController
public class AvisController extends CommonController {

    @RequestMapping(value = "/avis/{bookId}", method = RequestMethod.POST)
    @ResponseBody
    public String addAvis(@PathVariable("bookId") String livreId, @RequestBody Avis avis) throws Exception {
        Utilisateur proprietaire = userRepository.findproprietaire(livreId);
        Utilisateur auteurAvis = this.getPrincipal();
        avis.setAuteur(auteurAvis.getId());
        userRepository.saveAvis(proprietaire, livreId, avis);
        return "OK";
    }

    // Editer un avis : PUT
    @RequestMapping(value = "/avis/{avisId}", method = RequestMethod.PUT)
    public String editAvis(@PathVariable("avisId") String avisId, @RequestBody Avis avis) {
        userRepository.updateAvis(avisId, avis);
        return "OK";
    }

    @RequestMapping(value = "/avis/{avisId}", method = RequestMethod.DELETE)
    @ResponseBody
    public Livre deleteAvis(@PathVariable("avisId") String avisId) throws Exception {
        userRepository.deleteAvis(avisId);
        return null;
    }

}