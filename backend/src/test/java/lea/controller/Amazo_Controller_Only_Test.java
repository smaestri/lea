package lea.controller;

import lea.BeanUtils;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.ApplicationContext;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

@RunWith(SpringRunner.class)
@WebMvcTest(AmazonController.class)
//need to set proffle test to not load spring security configuration
@ActiveProfiles("test")
// It would be possible to desactivate SpringSecurity with below line,
// but we use @WithMockUser instead
//@AutoConfigureMockMvc(addFilters = false)
public class Amazo_Controller_Only_Test {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ApplicationContext appContext;

    @Test
    @WithMockUser
    public void testWithFrenchIsbn() throws Exception {
        BeanUtils.logBeans(appContext);
        // given

        //String frenchIsbn = "9782253066200"; english =9780132350884

        String isbn = "9782253066200";

        // when
         mockMvc.perform(get("/api/getBookInfoFromAmazon/" + isbn));

    }


}