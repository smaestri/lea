package lea.controller;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
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
        String url = "https://www.amazon.fr/s?i=stripbooks&rh=p_66%3A"+ isbn +"&s=relevancerank&Adv-Srch-Books-Submit.x=47&Adv-Srch-Books-Submit.y=14&__mk_fr_FR=%C3%85M%C3%85Z%C3%95%C3%91&unfiltered=1&ref=sr_adv_b";

        HashMap fetch = this.fetch(url, false);
        if(fetch == null) {
            url = "https://www.amazon.fr/s?i=english-books&rh=p_66%3A" + isbn+"&s=relevancerank&Adv-Srch-English-Books-Submit.x=25&Adv-Srch-English-Books-Submit.y=12&__mk_fr_FR=%C3%85M%C3%85Z%C3%95%C3%91&unfiltered=1&ref=sr_adv_english_books";
            fetch = this.fetch(url, true);
            if(fetch == null){
                System.out.print("Erreur during crawling");
                return null;
            }
        }
        return fetch;
    }

    private HashMap fetch(String url, boolean isEnglish) throws IOException {
        Document document = Jsoup.connect(url).userAgent( "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0").get();
        Elements bookTitle = document.select("span.a-size-medium");

        HashMap map = new HashMap<>();
        if(bookTitle.size() == 0) {
            return null;
        }

        Elements image = document.select("img.s-image");
        Element auteur;
        if(isEnglish) {
            auteur = document.select("div.a-row.a-size-base.a-color-secondary span.a-size-base").get(1);
        } else {
            auteur = document.select("div.a-row.a-size-base.a-color-secondary a.a-size-base.a-link-normal").get(0);

        }
        map.put("image", image.attr("src"));
        map.put("auteur", auteur.html());
        map.put("name", bookTitle.html());

        return map;

    }

}
