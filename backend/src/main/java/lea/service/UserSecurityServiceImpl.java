package lea.service;

import java.util.Arrays;
import java.util.Calendar;

import lea.modele.PasswordResetToken;
import lea.modele.Utilisateur;
import lea.repository.password.PasswordResetTokenRepository;
import lea.repository.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class UserSecurityServiceImpl implements UserSecurityService {

    @Autowired
    private PasswordResetTokenRepository passwordTokenRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public String validatePasswordResetToken(String id, String token) {
        final PasswordResetToken passToken = passwordTokenRepository.findByToken(token);
        if ((passToken == null) || (!passToken.getUserId().equals(id))) {
            return "invalidToken";
        }

        final Calendar cal = Calendar.getInstance();
        if ((passToken.getExpiryDate()
                .getTime() - cal.getTime()
                .getTime()) <= 0) {
            return "expired";
        }

        final String userId = passToken.getUserId();
        Utilisateur user = userRepository.findOne(userId);
        this.validToken(user);
        return null;
    }

    @Override
    public void authenticateManually(Utilisateur user) {
        CustomUserDetailsService.UserPrincipal principal = new CustomUserDetailsService.UserPrincipal(
                user.getFirstName(), user.getPassword(), CustomUserDetailsService.getGrantedAuthorities(user), user);
        Authentication authentication = new UsernamePasswordAuthenticationToken(principal, null,
                principal.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    @Override
    public void validToken(Utilisateur user) {
        Authentication auth = new UsernamePasswordAuthenticationToken(
                user, null, Arrays.asList(
                new SimpleGrantedAuthority("CHANGE_PASSWORD_PRIVILEGE")));
        SecurityContextHolder.getContext().setAuthentication(auth);
    }

}