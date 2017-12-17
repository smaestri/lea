package lea;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Map;
import lea.controller.LivreController;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import static org.assertj.core.api.Assertions.assertThat;

@RunWith(SpringRunner.class)
@SpringBootTest
public class SmokeTest {

    @Autowired
    private LivreController controller;

    @Test
    public void contexLoads() throws Exception {
        assertThat(controller).isNotNull();
        String frenchIsbn = "9782253066200";
       
        Map map = controller.crawlFromIsbn(frenchIsbn);
        assertThat(map.get("name")).isEqualTo("Juste retour des choses");

    }

    @Test
    public void testEnglishBook() throws Exception {

        String englishIsbn = "9788120340077";
        Map map = controller.crawlFromIsbn(englishIsbn);
        assertThat(map.get("name")).isEqualTo("Introduction to Algorithms");
    }


}