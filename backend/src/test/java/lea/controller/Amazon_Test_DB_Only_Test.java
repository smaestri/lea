package lea.controller;

import lea.BeanUtils;
import lea.modele.Utilisateur;
import lea.repository.user.MongoUserRepository;
import lea.repository.user.UserRepository;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.context.ApplicationContext;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.List;

import static org.junit.Assert.assertEquals;

@RunWith(SpringRunner.class)
@DataMongoTest
public class Amazon_Test_DB_Only_Test {

    @Autowired
    private MongoTemplate mongoTemplate;

    @Autowired
    private ApplicationContext appContext;

    @Autowired
    MongoUserRepository mongoUserRepository;

    @Test
    public void testWithFrenchIsbn() throws Exception {

        BeanUtils.logBeans(appContext);

        // given
        Utilisateur user = new Utilisateur();
        user.setEmail("user@yopmail.com");

        // when
        mongoTemplate.save(user);

        // then
        List<Utilisateur> all = mongoUserRepository.findByEmail("user@yopmail.com");
        assertEquals(all.size(), 1);

    }

}