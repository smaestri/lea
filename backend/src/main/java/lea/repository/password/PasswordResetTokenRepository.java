package lea.repository.password;

import lea.modele.PasswordResetToken;

import java.util.Date;
import java.util.stream.Stream;

public interface PasswordResetTokenRepository {

    PasswordResetToken findByToken(String token);
    PasswordResetToken findByUser(String userId);
    Stream<PasswordResetToken> findAllByExpiryDateLessThan(Date now);
    void deleteByExpiryDateLessThan(Date now);
    void deleteAllExpiredSince(Date now);
    void save(PasswordResetToken token);
}
