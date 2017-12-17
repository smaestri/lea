package lea.controller;

import lea.commun.StatutEmprunt;
import lea.modele.*;
import lea.repository.user.UserRepository;
import org.apache.http.HttpEntity;
import org.apache.http.HttpHeaders;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.hibernate.validator.internal.util.privilegedactions.GetMethod;
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
import java.util.HashMap;
import java.util.List;

@RestController
public class LivreController extends CommonController {

    @Autowired
    UserRepository userRepository;

    // Recherche generale
    @RequestMapping(value = "/api/searchBook", method = RequestMethod.GET)
    public List<Livre> searchBook(@RequestParam(value = "titreBook", required = false) String titre,
                                  @RequestParam(value = "categorie", required = false) String categorieId) throws ServletException, IOException {
        List<Livre> result = new ArrayList<Livre>();
        List<Utilisateur> allUsers = userRepository.findAll();

        Utilisateur principal = this.getPrincipal();
        Utilisateur userConnected = null;
        if (principal != null) {
            userConnected = this.userRepository.findOne(principal.getId());
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

                //If I'm connected, check if the user fetched is my friend and display :
                // - loan button
                // - pending : " user added as friend"
                if (userConnected != null && livre.getStatut().equals(StatutEmprunt.FREE)) {
                    //si ami
                    List<Utilisateur> friends = userRepository.findFriends(userConnected.getListFriendsId());
                    for (Utilisateur u : friends) {
                        if (user.getId().equals(u.getId())) {
                            livre.setEmpruntable(true);
                        }
                    }
                    List<PendingFriend> listPendingFriends = userConnected.getListPendingFriends();
                    for (PendingFriend pf : listPendingFriends) {
                        if (pf.getEmail().equals(user.getEmail())) {
                            livre.setPending(true);
                        }
                    }
                }
                // Add book if it matches search criteria (category, title) + set image
                addBookinlist(result, livre, categorieId, titre);
            }
        }
        return result;
    }


    @RequestMapping(value = "/api/livres/{livre}", method = RequestMethod.GET)
    public Livre detailLivreHandler(@PathVariable("livre") String idLivre) {
        Livre livreDetail = userRepository.findBook(idLivre);

        if (livreDetail.getCategorieId() != null) {
            Categorie cat = this.categorieRepository.findOne(livreDetail.getCategorieId());
            livreDetail.setCategorie(cat);
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
    @RequestMapping(value = "/api/livres/new", method = RequestMethod.POST)
    public Livre addLivre(@RequestBody Livre livre) {
        Utilisateur principal = getPrincipal();
        Utilisateur user = this.userRepository.findOne(principal.getId());
        livre.setStatut(StatutEmprunt.FREE);
        userRepository.saveLivre(user, livre);
        return livre;
    }

    // Editer un livre : PUT
    @RequestMapping(value = "/api/livres/{livre}", method = RequestMethod.PUT)
    public Livre addLivre(@PathVariable("livre") String livreId, @RequestBody Livre newLivre) {
        Utilisateur principal = getPrincipal();
        Utilisateur user = this.userRepository.findOne(principal.getId());
        Livre livre = user.getLivre(livreId);
        updateBook(livre, newLivre);
        userRepository.saveLivre(user, livre);
        return livre;
    }

    // My books
    @RequestMapping(value = "/api/myBooks", method = RequestMethod.GET)
    public List<Livre> myBooks(Model model) throws IOException {
        Utilisateur userDetail = getPrincipal();
        Utilisateur user = this.userRepository.findOne(userDetail.getId());
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

    private void updateBook(Livre exitingBook, Livre newLivre) {
        exitingBook.setAuteur(newLivre.getAuteur());
        exitingBook.setDescription(newLivre.getDescription());
        exitingBook.setCategorieId(newLivre.getCategorieId());
        exitingBook.setTitreBook(newLivre.getTitreBook());
        exitingBook.setIsbn(newLivre.getIsbn());
        exitingBook.setImage(newLivre.getImage());

    }


    @RequestMapping(value = "/api/getBookInfoFromAmazon/{isbn}", method = RequestMethod.GET)
    public HashMap crawlFromIsbn(@PathVariable("isbn") String isbn) throws IOException {
        String urlFrench = "https://www.amazon.fr/gp/search/ref=sr_adv_b/?search-alias=stripbooks&__mk_fr_FR=%C3%85M%C3%85Z%C3%95%C3%91&unfiltered=1&field-keywords=&field-author=&field-title=&field-isbn=" + isbn + "&field-publisher=&field-collection=&node=&field-binding_browse-bin=&field-dateop=&field-datemod=&field-dateyear=&sort=relevancerank&Adv-Srch-Books-Submit.x=37&Adv-Srch-Books-Submit.y=2";

        String urlproduct = this.getProductPageFromFrenchIsbn(urlFrench);
        if(urlproduct == "") {
            String urlEnglish = "https://www.amazon.fr/gp/search/ref=sr_adv_english_books/?search-alias=english-books&__mk_fr_FR=%C3%85M%C3%85Z%C3%95%C3%91&unfiltered=1&field-keywords=&field-author=&field-title=&field-isbn=" + isbn + "&field-publisher=&node=&field-binding_browse-bin=&field-dateop=&field-datemod=&field-dateyear=&sort=relevancerank&Adv-Srch-English-Books-Submit.x=31&Adv-Srch-English-Books-Submit.y=6";
            urlproduct = this.getProductPageFromEnglishIsbn(urlEnglish);
        }
        if (urlproduct == "") {
            return new HashMap();
        }
        return this.getInfosFomProductPage(urlproduct);
    }

    private String getProductPageFromFrenchIsbn(String url) throws IOException {
        String productUrl = "";
        CloseableHttpClient httpclient = HttpClients.createDefault();
        HttpGet httpGet = new HttpGet(url);
        httpGet.setHeader(HttpHeaders.USER_AGENT, "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0");
        CloseableHttpResponse response = httpclient.execute(httpGet);
        try {
            System.out.println(response.getStatusLine());
            HttpEntity entity = response.getEntity();
            String responseStr = (EntityUtils.toString(entity));
            int index = responseStr.indexOf("a-link-normal s-access-detail-page");
            if (index != -1) {
                String newString = responseStr.substring(index, index + 1000);
                int indexLink = newString.indexOf("href=");
                int lastindex = newString.indexOf("\">");
                productUrl = newString.substring(indexLink + 6, lastindex);
            }
            EntityUtils.consume(entity);
        } finally {
            response.close();
        }
        return productUrl;
    }

    private String getProductPageFromEnglishIsbn(String url) throws IOException {
                String productUrl = "";
                CloseableHttpClient httpclient = HttpClients.createDefault();
                System.out.println(url);
                HttpGet httpGet = new HttpGet(url);
                httpGet.setHeader(HttpHeaders.USER_AGENT, "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0");
                CloseableHttpResponse response = httpclient.execute(httpGet);
              
                try {
                    System.out.println(response.getStatusLine());
                    HttpEntity entity = response.getEntity();
                    String responseStr = (EntityUtils.toString(entity));
                    int index = responseStr.indexOf("a-link-normal s-access-detail-page");
                    if (index != -1) {
                        String newString = responseStr.substring(index, index + 1000);
                        System.out.println(newString);
                        int indexLink = newString.indexOf("href=");
                        int lastindex = newString.indexOf("\">");
                        productUrl = newString.substring(indexLink + 6, lastindex);
                    }

                    EntityUtils.consume(entity);
                } finally {
                    response.close();
                }
                return productUrl;
            }


    private HashMap getInfosFomProductPage(String url) throws IOException{
        System.out.println("********************GET INFO FROM AMAZON*************************************");
        System.out.println("*********************************************************");

        CloseableHttpClient httpclient = HttpClients.createDefault();
        HttpGet httpGet = new HttpGet(url);
        httpGet.setHeader(HttpHeaders.USER_AGENT, "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0");
        CloseableHttpResponse response = httpclient.execute(httpGet);
        HashMap map = new HashMap();
        String imageproduct = "", auteur = "", name = "";
        try {
            System.out.println(response.getStatusLine());
            HttpEntity entity = response.getEntity();
            String responseStr = (EntityUtils.toString(entity));
            int index = responseStr.indexOf("imgBlkFront");
            if (index == -1) {
                return new HashMap();
            }
            String blockImage = responseStr.substring(index, index + 300);
            System.out.println(blockImage);

            /* IMAGE*/
            int indexbeginImage = blockImage.indexOf("{&quot;") + 7;
            int indexlastImage = blockImage.indexOf(".jpg&quot;") + 4;
            imageproduct = blockImage.substring(indexbeginImage, indexlastImage);
            System.out.println("image");
            System.out.println(imageproduct);
            /* AUTEUR */
            int indexauteur = responseStr.indexOf("a-link-normal contributorNameID");
            System.out.println(indexauteur);
            if (indexauteur != -1) {
                String newString = responseStr.substring(indexauteur, indexauteur + 300);

                int indexbeginAuteur = newString.indexOf(">") + 1;
                int indexlastAuteur = newString.indexOf("</a>");
                auteur = newString.substring(indexbeginAuteur, indexlastAuteur);
                System.out.println("auteur");
                System.out.println(auteur);
            }
            else{
                auteur =  this.searchAuteurEnglish(responseStr);
            }

            /** NOM DU LIVRE */
            int indexbookTitle = responseStr.indexOf("id=\"productTitle\"");
            System.out.println(indexbookTitle);
            if (indexbookTitle != -1) {
                String newString = responseStr.substring(indexbookTitle, indexbookTitle + 300);

                int indexbeginName = newString.indexOf(">") + 1;
                int indexlastName = newString.indexOf("</span>");
                name = newString.substring(indexbeginName, indexlastName);
                System.out.println("titre");
                System.out.println(name);
            }


            System.out.println("*********************************************************");
            System.out.println("*********************************************************");

            EntityUtils.consume(entity);
        } finally {
            response.close();
        }

        map.put("image", imageproduct);
        map.put("auteur", auteur);
        map.put("name", name);
        return map;

    }

    private String searchAuteurEnglish(String responseStr){
          /* AUTEUR */
          int indexblocAuteur = responseStr.indexOf("<span class=\"author notFaded\"");
          String blocAuteur = responseStr.substring(indexblocAuteur, indexblocAuteur+300);
          int indexauteurEng = blocAuteur.indexOf("a-link-normal");
         // System.out.println("blocAuteur");
         // System.out.println(blocAuteur);
          String auteur ="";
          //System.out.println(indexauteur);
          if (indexauteurEng != -1) {
              String blockNameAuteur = blocAuteur.substring(indexauteurEng);

              int indexbeginAuteur = blockNameAuteur.indexOf(">") + 1;
              int indexlastAuteur = blockNameAuteur.indexOf("</a>");
              auteur = blockNameAuteur.substring(indexbeginAuteur, indexlastAuteur);
              System.out.println("auteur");
              System.out.println(auteur);
          }
          return auteur;

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

        setBookImage(livre);
        result.add(livre);
    }

    public static void setBookImage(Livre livre) {
        if(livre.getImage() == null || livre.getImage().isEmpty()) {
            livre.setImage("/webjars/app-react/1.0.0/img/book.png");
        }
    }
}
