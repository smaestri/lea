package lea.controller;

import lea.modele.Avis;
import lea.modele.Livre;
import lea.modele.Utilisateur;
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
        Avis newAvis = new Avis();
        newAvis.setNote(avis.getNote());
        newAvis.setLibelle(avis.getLibelle());
        newAvis.setAuteur(auteurAvis.getId());
        newAvis.setDateavis(new Date());
        // retrieve book from user
        List<Livre> livres = proprietaire.getLivres();
        Livre bookToSave = null;
        for (Livre livre : livres) {
            if (livre.getId().equals(livreId)) {
                bookToSave = livre;
                break;
            }
        }
        if (bookToSave != null) {
            bookToSave.getAvis().add(newAvis);
        }
        userRepository.saveUser(proprietaire);
        return newAvis.getId();
    }


    // Editer un avis : PUT
    @RequestMapping(value = "/api/avis/{avisId}/{bookId}", method = RequestMethod.PUT)
    public String editAvis(@PathVariable("avisId") String avisId,
                           @PathVariable("bookId") String bookId,
                           @RequestBody Avis avis) {
        //retrieve owner of the book
        Utilisateur owner = userRepository.findproprietaire(bookId);
        for (Livre livre : owner.getLivres()) {
            for (Avis oldAvis : livre.getAvis()) {
                if (oldAvis.getId().equals(avisId)) {
                    oldAvis.setLibelle(avis.getLibelle());
                    oldAvis.setNote(avis.getNote());
                    oldAvis.setDateavis(new Date());
                    break;
                }
            }
        }
        userRepository.saveUser(owner);
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