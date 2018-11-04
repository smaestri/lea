package lea.controller;

import lea.dto.AvisBean;
import lea.modele.Avis;
import lea.modele.Livre;
import lea.modele.Utilisateur;
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

    @RequestMapping(value = "/api/avis/{bookId}", method = RequestMethod.POST)
    @ResponseBody
    public String addAvis(@PathVariable("bookId") String livreId, @RequestBody AvisBean avisBean) throws Exception {
        Utilisateur proprietaire = userRepository.findproprietaire(livreId);
        Utilisateur auteurAvis = this.getPrincipal();
        Avis newAvis = new Avis();
        newAvis.setNote(avisBean.getNote());
        newAvis.setLibelle(avisBean.getLibelle());
        newAvis.setAuteur(auteurAvis.getId());
        newAvis.setDateavis(new Date());
        // retrieve book
        Optional<Livre> book = proprietaire.getLivre(livreId);
        if (book.isPresent()) {
            book.get().getAvis().add(newAvis);
        }
        userRepository.saveUser(proprietaire);
        return newAvis.getId();
    }


    // Editer un avis : PUT
    @RequestMapping(value = "/api/avis/{avisId}/{bookId}", method = RequestMethod.PUT)
    public String editAvis(@PathVariable("avisId") String avisId,
                           @PathVariable("bookId") String bookId,
                           @RequestBody AvisBean avisBean) {
        //retrieve owner of the book
        Utilisateur owner = userRepository.findproprietaire(bookId);
        owner.getLivres().stream().forEach(livre -> {
            Optional <Avis> optAvis = livre.getAvis().stream()
                    .filter(currentAvis -> currentAvis.getId().equals(avisId))
                    .findFirst();
            if(optAvis.isPresent()) {
                Avis avis = optAvis.get();
                avis.setLibelle(avisBean.getLibelle());
                avis.setNote(avisBean.getNote());
                avis.setDateavis(new Date());
            }
        });

//        for (Livre livre : owner.getLivres()) {
//            for (Avis oldAvis : livre.getAvis()) {
//                if (oldAvis.getId().equals(avisId)) {
//                    oldAvis.setLibelle(avisBean.getLibelle());
//                    oldAvis.setNote(avisBean.getNote());
//                    oldAvis.setDateavis(new Date());
//                    break;
//                }
//            }
//        }
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