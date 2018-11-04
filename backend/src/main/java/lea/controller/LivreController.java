package lea.controller;

import lea.commun.StatutEmprunt;
import lea.modele.Categorie;
import lea.modele.Emprunt;
import lea.modele.Livre;
import lea.modele.Utilisateur;
import lea.repository.categorie.CategorieRepository;
import lea.repository.emprunt.EmpruntRepository;
import lea.repository.user.MongoUserRepository;
import lea.repository.user.UserRepository;
import org.apache.http.HttpEntity;
import org.apache.http.HttpHeaders;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import javax.servlet.ServletException;
import javax.validation.Valid;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@RestController
public class LivreController extends CommonController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    private MongoUserRepository mongoUserRepository;

    @Autowired
    private EmpruntRepository empruntRepository;

    @Autowired
    private CategorieRepository categorieRepository;

    // Recherche generale
    @RequestMapping(value = "/api/searchBook", method = RequestMethod.GET)
    public List<Livre> searchBook(@RequestParam(value = "titreBook", required = false) String titre,
                                  @RequestParam(value = "categorie", required = false) String categorieId) throws ServletException, IOException {
        List<Livre> res = new ArrayList<Livre>();
        List<Utilisateur> allUsers = userRepository.findAll();
        Utilisateur principal = this.getPrincipal();
        Utilisateur userConnected = null;
        if (principal != null) {
            userConnected = this.mongoUserRepository.findById(principal.getId()).get();
        }
        for (Utilisateur user : allUsers) {
            if (userConnected != null && userConnected.getId().equals(user.getId())) {
                continue;
            }

            List<Livre> livres = user.getLivres();
            this.removeDeletedBooks(livres);

            for (Livre livre : livres) {
                livre.setUserId(user.getId());
                livre.setPreteur(user.getFullName());
                livre.setMailPreteur(user.getEmail());
                addBookinlist(livre, categorieId, titre, res);
            }
        }
        return res;
    }

    @RequestMapping(value = "/api/livres/{livre}", method = RequestMethod.GET)
    public Livre detailLivreHandler(@PathVariable("livre") String idLivre) {
        Optional<Livre> livreDetail = userRepository.findBook(idLivre);

        if (livreDetail.isPresent() && livreDetail.get().getCategorieId() != null) {
            Categorie cat = this.categorieRepository.findOne(livreDetail.get().getCategorieId());
            livreDetail.get().setCategorie(cat);
            return livreDetail.get();
        }
        return null;

    }

    //creeer un livre
    @RequestMapping(value = "/api/livres", method = RequestMethod.POST)
    public Livre addLivre(@Valid @RequestBody Livre livre) {
        Utilisateur principal = getPrincipal();
        Utilisateur user = this.mongoUserRepository.findById(principal.getId()).get();
        livre.setStatut(StatutEmprunt.FREE);
        userRepository.saveLivre(user, livre);
        return livre;
    }

    // Editer un livre
    @RequestMapping(value = "/api/livres", method = RequestMethod.PUT)
    public Livre editLivre(@Valid @RequestBody Livre newLivre) {
        Utilisateur principal = getPrincipal();
        Utilisateur user = this.mongoUserRepository.findById(principal.getId()).get();
        Optional<Livre> livre = user.getLivre(newLivre.getId());
        updateBook(livre, newLivre);
        if(livre.isPresent()){
            userRepository.saveLivre(user, livre.get());
            return livre.get();
        }
        return null;


    }

    // My books
    @RequestMapping(value = "/api/myBooks", method = RequestMethod.GET)
    public List<Livre> myBooks(Model model) throws IOException {
        Utilisateur userDetail = getPrincipal();
        Utilisateur user = this.mongoUserRepository.findById(userDetail.getId()).get();
        List<Livre> livres = user.getLivres();
        this.removeDeletedBooks(livres);
        if (livres != null && livres.size() > 0) {
            for (Livre livre : livres) {
                this.setBookImage(livre);
                livre.setUserId(user.getId());
            }
        }
        return livres;
    }

    // Supprimer livre : DELETE
    @RequestMapping(value = "/api/livres/{livre}", method = RequestMethod.DELETE)
    public String deleteLivre(@PathVariable("livre") String livreId) throws Exception {
        Utilisateur user = getPrincipal();

        Emprunt empruntFromBook = empruntRepository.findEmpruntFromBook(livreId);
        if (empruntFromBook == null) {
            userRepository.supprimerLivre(livreId, user.getId());
            return "1";
        }

        return "0";
    }

    private void updateBook(Optional<Livre> optexitingBook, Livre newLivre) {
        if(optexitingBook.isPresent()){
            Livre exitingBook = optexitingBook.get();
            exitingBook.setAuteur(newLivre.getAuteur());
            exitingBook.setDescription(newLivre.getDescription());
            exitingBook.setCategorieId(newLivre.getCategorieId());
            exitingBook.setTitreBook(newLivre.getTitreBook());
            exitingBook.setIsbn(newLivre.getIsbn());
            exitingBook.setImage(newLivre.getImage());
        }
    }

    private void addBookinlist(Livre livre, String categorieId, String titre, List<Livre> res) throws IOException {
        boolean addLivre = true;
        if (categorieId != null && StringUtils.hasText(categorieId)) {
            if (livre.getCategorieId() == null || !livre.getCategorieId().equals(categorieId)) {
                addLivre = false;
            }
        }

        //Check titre
        if (titre != null && StringUtils.hasText(titre)) {
            if (livre.getTitreBook().equalsIgnoreCase(titre)) {
                addLivre = false;
            }
        }

        setBookImage(livre);
        if (addLivre) {
            res.add(livre);
        }

    }

    public static void setBookImage(Livre livre) {
        if (livre.getImage() == null || livre.getImage().isEmpty()) {
            livre.setImage("/webjars/app-react/1.0.0/img/book.png");
        }
    }
}
