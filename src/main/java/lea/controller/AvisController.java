package lea.controller;

import lea.modele.Avis;
import lea.modele.BaseDocumentImpl;
import lea.modele.Livre;
import lea.modele.Utilisateur;
import org.springframework.web.bind.annotation.*;

@RestController
public class AvisController extends CommonController {

    @RequestMapping(value = "/addAvis/{bookId}", method = RequestMethod.POST)
    @ResponseBody
    public Livre addAvis(@PathVariable("bookId") String livreId, @RequestBody Avis avis) throws Exception {
        Utilisateur principal = getPrincipal();
        avis.setAuteur(principal.getId());
        Livre livre = userRepository.findBook(livreId);
        Utilisateur proprietaire = userRepository.findOne(livre.getUserId());
        userRepository.saveAvis(proprietaire, livre, avis);
        return livre;
    }

    @RequestMapping(value = "/deleteAvis/{avisId}", method = RequestMethod.POST)
    @ResponseBody
    public Livre deleteAvis(@PathVariable("avisId") String avisId) throws Exception {
//        Utilisateur principal = getPrincipal();
//        Avis avis = userRepository.findAvis(avisId);
//        Livre livre = userRepository.findBook(avis.getBookId());
//        livre.getAvis().remove(avis);
//        userRepository.deleteAvis(principal, livre, avis);
//        return livre;
        return null;
    }

}