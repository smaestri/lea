package lea;

import lea.modele.Avis;
import lea.modele.Livre;
import lea.modele.UserProfile;
import lea.modele.Utilisateur;
import lea.repository.avis.MongoAvisRepository;
import lea.repository.userprofile.MongoUserProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.support.SpringBootServletInitializer;
import org.springframework.context.annotation.ImportResource;

import java.util.Date;

@SpringBootApplication
@ImportResource({
        "security.xml"
})
public class Application extends SpringBootServletInitializer {

    @Autowired
    private MongoAvisRepository avisRepo;

    @Autowired
    private MongoUserProfileRepository mongoUserProfileRepository;

    public static void main(String[] args) throws Exception {
        SpringApplication.run(Application.class, args);
    }

    /*
    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(Application.class);
    }



    @Override
    public void run(String... args) throws Exception {
        this.avisRepo.deleteAll();

        // save a couple of customers
        Avis avis = new Avis();
        //avis.setId();
        avis.setDateavis(new Date());
        avis.setLibelle("111");
        avis.setDateavis(new java.util.Date());
        Utilisateur user = new Utilisateur();
        user.setFirstName("2222");
        user.setLastName("3333");
        avis.setAuteur(user);

        Livre livre = new Livre();
        livre.setTitreBook("444");
        avis.setLivre(livre);

        this.avisRepo.save(avis);
        UserProfile up = new UserProfile();
        mongoUserProfileRepository.save(up);

        // fetch all customers
        for (Avis avis2 : this.avisRepo.findAll()) {
            System.out.println(avis2);
        }
        System.out.println();
        // fetch all customers
        for (UserProfile up2 : this.mongoUserProfileRepository.findAll()) {
            System.out.println(up2);
        }
        System.out.println();

    }
      */


}
