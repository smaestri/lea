package lea.controller;

import lea.commun.StatutEmprunt;
import lea.modele.*;
import lea.repository.user.UserRepository;
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

@RestController
public class LivreController extends CommonController {

    @Autowired
    UserRepository userRepository;

    public static void setBookImage(Livre livre) throws IOException {
        /*
        CloseableHttpClient httpclient = HttpClients.createDefault();
        String bookImageUrl = "http://covers.openlibrary.org/b/isbn/" + livre.getIsbn() + "-M.jpg";
        HttpGet httpget = new HttpGet(bookImageUrl);
        CloseableHttpResponse response = null;
        try {
            response = httpclient.execute(httpget);
            if (response.getEntity().getContentType() == null || !response.getEntity().getContentType().getValue().equals("image/jpeg")) {
            */
        livre.setImage("assets/img/book.png");
        /*
            } else {
                livre.setImage(bookImageUrl);
            }
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            response.close();
        }
        */
    }

    // Recherche generale
    @RequestMapping(value = "/searchBook", method = RequestMethod.GET)
    public List<Livre> searchBook(@RequestParam(value = "titreBook", required = false) String titre,
                             @RequestParam(value = "categorie", required = false) String categorieId) throws ServletException, IOException {
        Utilisateur principal = getPrincipal();
        List<Livre> result = new ArrayList<Livre>();
        List<Utilisateur> friends = userRepository.findFriends(principal.getListFriendsId());
        for (Utilisateur friend : friends) {
            for (Livre livre : friend.getLivres()) {
                livre.setUserId(friend.getId());
                addBookinlist(result, livre, categorieId, titre);
            }
            List<Utilisateur> subFriends = userRepository.findFriends(friend.getListFriendsId());
            for (Utilisateur subFriend :subFriends) {
                //L'ami d'ami ne doit pas etre l'utilisateur connecté
                if (!subFriend.getEmail().equals(principal.getEmail())) {
                    for (Livre livre : subFriend.getLivres()) {
                        //Si le livre n'a pas deja été ajoute (ami niveau 1 peut avoir le livre)
                        if (!isBookInside(result, livre.getId())) {
                            livre.setUserId(subFriend.getId());
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
            livreRetour.setCategorieId(cat.getId());
        }

       // model.addAttribute("command", livreRetour);
       // model.addAttribute("livres", result);

        return result;
    }

    private void addBookinlist(List<Livre> result, Livre livre, String categorieId, String titre) throws IOException {
        boolean addLivre = true;
        if (categorieId != null && StringUtils.hasText(categorieId)) {
            if (livre.getCategorieId().equals(categorieId)) {
                addLivre = false;
            }
        }

        //Check titre
        if (titre != null && StringUtils.hasText(titre)) {
            if (livre.getTitreBook().equalsIgnoreCase(titre)) {
                addLivre = false;
            }
        }

        if (addLivre && livre.getStatut() == StatutEmprunt.FREE) {
            //setBookImage(livre);
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

    @RequestMapping(value = "/livres/{livre}", method = RequestMethod.GET)
    public Livre detailLivreHandler(@PathVariable("livre") String idLivre) {
        Livre livreDetail = userRepository.findBook(idLivre);

        if(livreDetail.getCategorieId() != null){
            Categorie cat = this.categorieRepository.findOne(livreDetail.getCategorieId());
            livreDetail.setCategorie(cat);
            /*
            try {
                setBookImage(livreDetail);
            } catch (IOException e) {
                e.printStackTrace();
            }
            */

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

    // Creer un livre : POST
    @RequestMapping(value = "/livres/new", method = RequestMethod.POST)
    public Livre addLivre(@RequestBody Livre livre) {
        Utilisateur principal = getPrincipal();
        Utilisateur user = this.userRepository.findOne(principal.getId());
        livre.setStatut(StatutEmprunt.FREE);
        userRepository.saveLivre(user, livre);
        return livre;
    }

    // Editer un livre : PUT
    @RequestMapping(value = "/livres/{livre}", method = RequestMethod.PUT)
    public Livre addLivre(@PathVariable("livre") String livreId, @RequestBody Livre newLivre) {
        Utilisateur principal = getPrincipal();
        Utilisateur user = this.userRepository.findOne(principal.getId());
        Livre livre = user.getLivre(livreId);
        updateBook(livre, newLivre);
        userRepository.saveLivre(user, livre);
        return livre;
    }

    /**
     * FIXME better way to manage it?
     */
    private void updateBook(Livre exitingBook, Livre newLivre) {
        exitingBook.setAuteur(newLivre.getAuteur());
        exitingBook.setDescription(newLivre.getDescription());
        exitingBook.setCategorieId(newLivre.getCategorieId());
        exitingBook.setTitreBook(newLivre.getTitreBook());
        exitingBook.setIsbn(newLivre.getIsbn());

    }

    // My books
    @RequestMapping(value = "/myBooks", method = RequestMethod.GET)
    public List<Livre> myBooks(Model model) throws IOException {
        Utilisateur userDetail = getPrincipal();
        Utilisateur user = this.userRepository.findOne(userDetail.getId());
        List<Livre> livres = user.getLivres();
        if (livres != null && livres.size() > 0) {
            for (Livre livre : livres) {
                this.setBookImage(livre);
                livre.setUserId(user.getId());
            }
        }
        return livres;
    }

    // Supprimer livre : DELETE
    @RequestMapping(value = "/livres/{livre}", method = RequestMethod.DELETE)
    public String deleteLivre(@PathVariable("livre") String livreId) throws Exception {
        Utilisateur user = getPrincipal();

        Emprunt empruntFromBook = empruntRepository.findEmpruntFromBook(livreId);
        if(empruntFromBook == null){
            userRepository.supprimerLivre(livreId, user.getId());
            return "1";
        }

        return "0";
    }

}
