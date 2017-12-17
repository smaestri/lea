package lea;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.support.SpringBootServletInitializer;
import org.springframework.context.annotation.ImportResource;

@SpringBootApplication
//@ImportResource({"messages.xml"})
public class Application {
        public static void main(String[] args) throws Exception {
        SpringApplication.run(Application.class, args);
    }

}
