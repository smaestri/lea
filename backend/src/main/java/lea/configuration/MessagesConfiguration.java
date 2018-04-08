package lea.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.ResourceBundleMessageSource;

@Configuration
public class MessagesConfiguration extends ResourceBundleMessageSource {

    @Bean
    public ResourceBundleMessageSource messConf(){
        ResourceBundleMessageSource conf = new ResourceBundleMessageSource();
        conf.setBasename("classpath:mymessages");
        return conf;
    }

}