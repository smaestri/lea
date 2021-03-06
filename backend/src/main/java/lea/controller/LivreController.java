package lea.controller;

import lea.commun.StatutEmprunt;
import lea.modele.*;
import lea.repository.categorie.CategorieRepository;
import lea.repository.categorie.MongoCategorieRepository;
import lea.repository.emprunt.EmpruntRepository;
import lea.repository.livremodel.MongoLivreModelRepository;
import lea.repository.user.MongoUserRepository;
import lea.repository.user.UserRepository;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.servlet.ServletException;
import javax.validation.Valid;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
public class LivreController extends CommonController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    private MongoUserRepository mongoUserRepository;

    @Autowired
    private MongoLivreModelRepository mongoLivreModelRepository;

    @Autowired
    private EmpruntRepository empruntRepository;

    @Autowired
    private CategorieRepository categorieRepository;


    @Autowired
    private MongoCategorieRepository mongoCategorieRepository;

    // Recherche generale
    @RequestMapping(value = "/api/searchBook", method = RequestMethod.GET)
    public List<Livre> searchBook(@RequestParam(value = "search", required = false) String search,
                                  @RequestParam(value = "categorie", required = false) String categorieId) throws ServletException, IOException {
        List<Livre> res = new ArrayList<Livre>();
        List<Utilisateur> allUsers = userRepository.findAll();
        Utilisateur principal = this.getPrincipal();
        Utilisateur userConnected = null;
        if (principal != null) {
            userConnected = this.mongoUserRepository.findById(principal.getId()).get();
        }
        for (Utilisateur user : allUsers) {
            //do not retrieve bokk of user connected
            if (userConnected != null && userConnected.getId().equals(user.getId())) {
                continue;
            }

            List<Livre> livres = user.getLivres();

            for (Livre livre : livres) {
                //retrieve book model
                Optional<LivreModel> byId = this.mongoLivreModelRepository.findById(livre.getLivreModelId());
                livre.setLivreModel(byId.get());
                livre.setUserId(user.getId());
                livre.setPreteur(user.getFullName());
                livre.setMailPreteur(user.getEmail());
                addBookinlist(livre, categorieId, search, res);
            }
        }

        return res;
    }

    /**
     * Détail d'un livre
     *
     * @param livreModelId
     * @return
     */
    @RequestMapping(value = "/api/livres/{livremodel}", method = RequestMethod.GET)
    public LivreModel detailLivreHandler(@PathVariable("livremodel") String livreModelId) {

        Optional<LivreModel> optLm = this.mongoLivreModelRepository.findById(livreModelId);

        if(optLm.isPresent()) {
            LivreModel livreModel = optLm.get();
            if (livreModel.getCategorieId() != null) {
                Categorie cat = this.mongoCategorieRepository.findById(livreModel.getCategorieId()).get();
                livreModel.setCategorie(cat);
                return livreModel;
            }
        }
        return null;
    }

    //creer un livremodel
    @RequestMapping(value = "/api/livres", method = RequestMethod.POST)
    public Livre addLivre(@Valid @RequestBody LivreModel livreModel) {
        Utilisateur principal = getPrincipal();
        Utilisateur user = this.mongoUserRepository.findById(principal.getId()).get();
        Livre userLivre = new Livre();
        userLivre.setStatut(StatutEmprunt.FREE);
        LivreModel newLivreModel = this.mongoLivreModelRepository.findByIsbn(livreModel.getIsbn());
        if (newLivreModel == null) {
            //save only first 10 of isbn
            if (livreModel.getIsbn().length() > 10) {
                livreModel.setIsbn(livreModel.getIsbn().substring(0, 9));
            }
            this.mongoLivreModelRepository.save(livreModel);
            newLivreModel = livreModel;
        }
        //save user book
        userLivre.setLivreModel(newLivreModel);
        userLivre.setLivreModelId(newLivreModel.getId());
        userRepository.saveLivre(user, userLivre);
        return userLivre;
    }

    // Editer un livremodel
    @RequestMapping(value = "/api/updateLivreCategory", method = RequestMethod.PUT)
    public String editLivre( @RequestParam(value = "livreModelId", required = false) String livreModelId,
                            @RequestParam(value = "categorieId", required = false) String categorieId) {

        Optional<LivreModel> livre = this.mongoLivreModelRepository.findById(livreModelId);
        if(livre.isPresent()){
            livre.get().setCategorieId(categorieId);
            mongoLivreModelRepository.save(livre.get());
            return "OK";
        }
        return "KO";
    }

    // My books
    @RequestMapping(value = "/api/myBooks", method = RequestMethod.GET)
    public List<Livre> myBooks(Model model) throws IOException {
        Utilisateur userDetail = getPrincipal();
        Utilisateur user = this.mongoUserRepository.findById(userDetail.getId()).get();
        List<Livre> livres = user.getLivres();
        if (livres != null && livres.size() > 0) {
            for (Livre livre : livres) {
                // retrive bookmodel
                LivreModel livremodel = this.mongoLivreModelRepository.findById(livre.getLivreModelId()).get();
                this.setBookImage(livremodel);
                livre.setUserId(user.getId());
                ;
                livre.setLivreModel(livremodel);
            }
        }
        return livres;
    }

    // Supprimer livremodel : DELETE
    @RequestMapping(value = "/api/livres/{livremodel}", method = RequestMethod.DELETE)
    public String deleteLivre(@PathVariable("livremodel") String livreId) throws Exception {
        Utilisateur user = getPrincipal();

        Emprunt empruntFromBook = empruntRepository.findEmpruntFromBook(livreId);
        if (empruntFromBook == null) {
            userRepository.supprimerLivre(livreId, user.getId());
            return "1";
        }

        return "0";
    }

    private void addBookinlist(Livre livre, String categorieId, String search, List<Livre> res)  {
        boolean addLivre = true;

        //check categorie
        if (StringUtils.isNotBlank(categorieId)) {
            String categorieId1 = livre.getLivreModel().getCategorieId();
            if (StringUtils.isNotBlank(categorieId1) && !categorieId1.equals(categorieId)) {
                addLivre = false;
            }
        }

        //Check search : title, auteur, description
        if (search != null && !StringUtils.containsIgnoreCase(livre.getLivreModel().getTitreBook(), search)
                && !StringUtils.containsIgnoreCase(livre.getLivreModel().getAuteur(), search)
                && !StringUtils.containsIgnoreCase(livre.getLivreModel().getDescription(), search)) {
            addLivre = false;
        }

        setBookImage(livre.getLivreModel());
        if (addLivre) {
            res.add(livre);
        }

    }

    public static void setBookImage(LivreModel livre) {
        if (livre.getImage() == null || livre.getImage().isEmpty()) {
            livre.setImage("/webjars/app-react/1.0.0/img/book.png");
        }
    }
}
