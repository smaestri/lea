package lea.repository.password;

import lea.modele.PasswordResetToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.stream.Stream;

@Repository
public class PasswordResetTokenRepositoryImpl implements PasswordResetTokenRepository {

    @Autowired
    private MongoPasswordResetRepository mongoPassRepository;

    @Autowired
    private MongoTemplate mongoTemplate;

    @Override
    public PasswordResetToken findByToken(String token) {
        Query q = new Query();
        q.addCriteria(Criteria.where("token").is(token));
        PasswordResetToken tokenObject = mongoTemplate.findOne(q, PasswordResetToken.class);
        return tokenObject;
    }

    @Override
    public PasswordResetToken findByUser(String userId) {
        return null;
    }

    @Override
    public Stream<PasswordResetToken> findAllByExpiryDateLessThan(Date now) {
        return null;
    }

    @Override
    public void deleteByExpiryDateLessThan(Date now) {

    }

    @Override
    public void deleteAllExpiredSince(Date now) {

    }

    @Override
    public void save(PasswordResetToken token) {
        this.mongoPassRepository.save(token);

    }
}
