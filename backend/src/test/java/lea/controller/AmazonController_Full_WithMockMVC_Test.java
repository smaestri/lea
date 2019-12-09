//package lea.controller;
//
//import lea.BeanUtils;
//import lea.modele.Utilisateur;
//import org.junit.Before;
//import org.junit.Test;
//import org.junit.runner.RunWith;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.boot.web.server.LocalServerPort;
//import org.springframework.context.ApplicationContext;
//import org.springframework.data.mongodb.core.MongoTemplate;
//import org.springframework.security.test.context.support.WithMockUser;
//import org.springframework.test.context.junit4.SpringRunner;
//import org.springframework.test.web.servlet.MockMvc;
//import org.springframework.test.web.servlet.ResultActions;
//import org.springframework.test.web.servlet.setup.MockMvcBuilders;
//import org.springframework.web.context.WebApplicationContext;
//
//import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
////cf. https://www.baeldung.com/spring-security-integration-tests
//
//
//@RunWith(SpringRunner.class)
//@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
//public class AmazonController_Full_WithMockMVC_Test {
//
//    @LocalServerPort
//    private int port;
//
//    private MockMvc mvc;
//
//    @Autowired
//    private ApplicationContext appContext;
//
//    @Autowired
//    private WebApplicationContext webAppContext;
//
//    @Autowired
//    private MongoTemplate mongoTemplate;
//
//    @Before
//    public void setup() {
//        mvc = MockMvcBuilders
//                .webAppContextSetup(webAppContext)
//                .apply(springSecurity())
//                .build();
//    }
//
//    @Test
//    @WithMockUser
//    public void testWithFrenchIsbn() throws Exception {
//
//        BeanUtils.logBeans(appContext);
//
//        // given
//        Utilisateur user = new Utilisateur();
//        user.setEmail("user@yopmail.com");
//
//        // when
//        mongoTemplate.save(user);
//        String frenchIsbn = "9782253066200";
//
//        //when
//        // String forObject = restTemplate.withBasicAuth("spring", "secret").getForObject("http://localhost:" + port + "/api/getBookInfoFromAmazon/" + frenchIsbn, String.class);
//        ResultActions perform = mvc.perform(get("/api/getBookInfoFromAmazon/" + frenchIsbn)).;
//
//        // then
//       // assertEquals(forObject, "toto");
//
//    }
//
//}