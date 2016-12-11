package lea.controller;

import lea.modele.Categorie;
import lea.modele.Livre;
import lea.modele.Utilisateur;
import lea.repository.livre.LivreRepository;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.StringUtils;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.support.SessionStatus;

import javax.servlet.ServletException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Controller
public class LivreController extends CommonController {

    @Autowired
    LivreRepository livreRepository;

    public static void setBookImage(Livre livre) throws IOException {
        CloseableHttpClient httpclient = HttpClients.createDefault();
        String bookImageUrl = "http://covers.openlibrary.org/b/isbn/" + livre.getIsbn() + "-M.jpg";
        HttpGet httpget = new HttpGet(bookImageUrl);
        CloseableHttpResponse response = null;
        try {
            response = httpclient.execute(httpget);
            if (response.getEntity().getContentType() == null || !response.getEntity().getContentType().getValue().equals("image/jpeg")) {
                livre.setImage("resources/img/book.png");
            } else {
                livre.setImage(bookImageUrl);
            }
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            response.close();
        }
    }

    // Recherche generale
    @RequestMapping(value = "/searchBook", method = RequestMethod.GET)
    public String searchBook(Model model,
                             @RequestParam(value = "titreBook", required = false) String titre,
                             @RequestParam("categorie") String categorieId) throws ServletException, IOException {
        Utilisateur principal = initSearchFormAndPrincipal(model, true);
        List<Livre> result = new ArrayList<Livre>();
        for (Utilisateur friend : principal.getUserFriends()) {
            Utilisateur userDetail = userRepository.findOne(friend.getId());
            for (Livre livre : userDetail.getLivres()) {
                addBookinlist(result, livre, categorieId, titre);
            }
            for (Utilisateur friend2level : userDetail.getUserFriends()) {
                Utilisateur userDetail2level = userRepository.findOne(friend2level.getId());
                //L'ami d'ami ne doit pas etre l'utilisateur connecté
                if (!friend2level.getEmail().equals(principal.getEmail())) {
                    for (Livre livre : userDetail2level.getLivres()) {

                        //Si le livre n'a pas deja été ajoute (ami nbiveau 1 peut avoir le livre)
                        if (!isBookInside(result, livre.getId())) {
                            addBookinlist(result, livre, categorieId, titre);
                        }
                    }
                }
            }
        }


        // setter barre de recherche
        Livre livreRetour = new Livre();
        if (titre != null && StringUtils.hasText(titre)) {
            livreRetour.setTitreBook(titre);
        }
        if (categorieId != null && StringUtils.hasText(categorieId)) {
            Categorie cat = categorieRepository.findOne(categorieId);
            livreRetour.setCategorie(cat);
        }

        model.addAttribute("command", livreRetour);
        model.addAttribute("livres", result);

        return "livre/search-result";
    }

    private void addBookinlist(List<Livre> result, Livre livre, String categorieId, String titre) throws IOException {

        boolean addLivre = true;

        if (categorieId != null && StringUtils.hasText(categorieId)) {
            if (livre.getCategorie().getId().equals(categorieId)) {
                addLivre = false;
            }
        }

        //Check titre
        if (titre != null && StringUtils.hasText(titre)) {
            if (livre.getTitreBook().equalsIgnoreCase(titre)) {
                addLivre = false;
            }
        }

        if (addLivre) {
            setBookImage(livre);
            result.add(livre);
        }
    }

    private boolean isBookInside(List<Livre> liste, String id) {

        for (Livre livre : liste) {
            if (livre.getId().equals(id)) {
                return true;
            }
        }
        return false;

    }

    @RequestMapping(value = "/livres/{livre}", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public Livre detailLivreHandler(@PathVariable("livre") String livre) {
        // initSearchFormAndPrincipal(model, false);
        Livre livreDetail = livreRepository.findOne(livre);
        try {
            setBookImage(livreDetail);
        } catch (IOException e) {
            e.printStackTrace();
        }

        return livreDetail;
    }

	/*
    @RequestMapping(value = "/getDetailFromAmazon/{isbn}", method = RequestMethod.GET)
	@ResponseBody
	public HashMap getDetailFromAmazon(@PathVariable("isbn") String isbn){

		HashMap bookinformation = Aws.getBookinformation(isbn);
		return bookinformation;
	}
	*/


    // Editer un livre : GET
    @RequestMapping(value = "/livres/edit/{livre}", method = RequestMethod.GET)
    public String editLivre(@PathVariable("livre") String livreId, Model model) {
        initSearchFormAndPrincipal(model, false);
        model.addAttribute("livre", livreRepository.findOne(livreId));
        return "livre/add-book";
    }

    // Creer un livre : GET
    @RequestMapping(value = "/livres/new", method = RequestMethod.GET)
    public String addLivre(Model model) {
        initSearchFormAndPrincipal(model, false);
        model.addAttribute("livre", new Livre());
        return "livre/add-book";
    }


    // Creer un livre : POST
    @RequestMapping(value = "/livres/new", method = RequestMethod.POST)
    public String addLivre(@ModelAttribute("livre") Livre livre, BindingResult result, Model model) {

        Utilisateur user = initSearchFormAndPrincipal(model, false);

        if (livre == null || livre.getTitreBook() == null || livre.getTitreBook().isEmpty()) {
            result.rejectValue("titreBook", "titreBook.notvalid", "Veuillez indiquer un titre");
            return "livre/add-book";
        }

        if (livre.getAuteur() == null || livre.getAuteur().isEmpty()) {
            result.rejectValue("auteur", "auteur.notvalid", "Veuillez indiquer un auteur");
            return "livre/add-book";
        }

        if (livre.getCategorie() == null || livre.getCategorie().getId() == null) {
            result.rejectValue("categorie", "categorie.notvalid", "Veuillez indiquer une catégorie");
            return "livre/add-book";
        }

        livre.setUser(user);
        livreRepository.saveLivre(livre);
        return "redirect:/myBooks";
    }


    // My books
    @RequestMapping(value = "/myBooks", method = RequestMethod.GET)
    public String myBooks(Model model) throws IOException {
        Utilisateur user = initSearchFormAndPrincipal(model, false);

        //Convert to list to get ordrer
        List<Livre> listeRetour = new ArrayList<Livre>(user.getLivres());

        for (Livre livre : listeRetour) {
            this.setBookImage(livre);
        }

        model.addAttribute("mesLivres", listeRetour);

        return "livre/my-books";
    }

    // Supprimer livre : POST
    @RequestMapping(value = "/deleteBook", method = RequestMethod.POST)
    public String deleteLivre(@ModelAttribute("book_id") String bookId) throws Exception {
        Utilisateur user = getPrincipal();
        Livre livre = livreRepository.findOne(bookId);
        if (!livre.getUser().getEmail().equals(user.getEmail())) {
            throw new Exception("Probleme de securite");
        }
        livreRepository.supprimerLivre(bookId);
        return "redirect:/myBooks";
    }

    // Editer livre : POST
    @RequestMapping(value = "/livres/{bookId}/edit", method = {RequestMethod.PUT, RequestMethod.POST})
    public String proceddEditLivre(@ModelAttribute("livre") Livre livre, SessionStatus status) {
        Utilisateur user = getPrincipal();
        livreRepository.saveLivre(livre);
        status.setComplete();
        return "redirect:/account";
    }

    @ModelAttribute("categories")
    public Collection<Categorie> populateCategories() {
        return (Collection<Categorie>) this.categorieRepository.findAll();
    }

}
