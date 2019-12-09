package lea.configuration;

import com.mongodb.MongoClient;
import com.mongodb.MongoCredential;
import com.mongodb.ServerAddress;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.AbstractMongoConfiguration;

import static java.util.Collections.singletonList;

@Configuration
public class MongoAuthenticationConfig extends AbstractMongoConfiguration {

    @Override
    public String getDatabaseName() {
        return "lea";
    }

    @Value("${mongo.ip}")
    private String ip;

    @Value("${mongo.port}")
    private int port;

    @Override
    public MongoClient mongoClient() {
        return new MongoClient(singletonList(new ServerAddress(ip, port)),
                singletonList(MongoCredential.createCredential("admin", "admin", "password".toCharArray())));
    }
}