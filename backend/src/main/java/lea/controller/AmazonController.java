package lea.controller;

import org.apache.http.HttpEntity;
import org.apache.http.HttpHeaders;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.HashMap;

@RestController
public class AmazonController {

    @RequestMapping(value = "/api/getBookInfoFromAmazon/{isbn}", method = RequestMethod.GET)
    public HashMap crawlFromIsbn(@PathVariable("isbn") String isbn) throws IOException {
        String urlFrench = "https://www.amazon.fr/gp/search/ref=sr_adv_b/?search-alias=stripbooks&__mk_fr_FR=%C3%85M%C3%85Z%C3%95%C3%91&unfiltered=1&field-keywords=&field-author=&field-title=&field-isbn=" + isbn + "&field-publisher=&field-collection=&node=&field-binding_browse-bin=&field-dateop=&field-datemod=&field-dateyear=&sort=relevancerank&Adv-Srch-Books-Submit.x=37&Adv-Srch-Books-Submit.y=2";

        String urlproduct = this.getProductPageFromFrenchIsbn(urlFrench);
        if (urlproduct == "") {
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


    private HashMap getInfosFomProductPage(String url) throws IOException {
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
            } else {
                auteur = this.searchAuteurEnglish(responseStr);
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

    private String searchAuteurEnglish(String responseStr) {
        /* AUTEUR */
        int indexblocAuteur = responseStr.indexOf("<span class=\"author notFaded\"");
        String blocAuteur = responseStr.substring(indexblocAuteur, indexblocAuteur + 1500);
        int indexauteurEng = blocAuteur.indexOf("a-link-normal");
        // System.out.println("blocAuteur");
        // System.out.println(blocAuteur);
        String auteur = "";
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
}
