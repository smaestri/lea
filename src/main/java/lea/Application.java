package lea;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.support.SpringBootServletInitializer;
import org.springframework.context.annotation.ImportResource;

@SpringBootApplication
@ImportResource({
        "security.xml"
})
public class Application extends SpringBootServletInitializer {
        public static void main(String[] args) throws Exception {
        SpringApplication.run(Application.class, args);
    }

}
