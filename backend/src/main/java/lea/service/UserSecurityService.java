package lea.service;

import lea.modele.Utilisateur;

public interface UserSecurityService {
    String validatePasswordResetToken(String s, String t);
    void authenticateManually(Utilisateur user);
    void validToken(Utilisateur user);
    void createPasswordResetTokenForUser(Utilisateur user, String token);
}
