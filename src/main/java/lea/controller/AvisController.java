package lea.controller;

import lea.dto.AvisBean;
import lea.modele.Avis;
import lea.modele.Livre;
import lea.modele.Utilisateur;
import lea.repository.avis.AvisRepository;
import lea.repository.livre.LivreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Date;

@RestController
public class AvisController extends CommonController {

    @Autowired
    LivreRepository livreRepository;

    @Autowired
    private AvisRepository avisRepository;

    // Liste emprunts de l'utilisateur connecté
    @RequestMapping(value = "/addAvis/{bookId}", method = RequestMethod.POST)
    @ResponseBody
    public String addAvis(@PathVariable("bookId") String livreId, @RequestBody AvisBean avisBean) throws Exception {
        Livre livreDetail = livreRepository.findOne(livreId);
        Utilisateur principal = getPrincipal();
        Avis avis = new Avis();
        avis.setDateavis(new Date());
        avis.setLibelle(avisBean.getLibelle());
        avis.setNote(avisBean.getNote());
        avis.setAuteur(principal);
        avis.setLivre(livreDetail);
        avisRepository.save(avis);

        return "";
    }

}