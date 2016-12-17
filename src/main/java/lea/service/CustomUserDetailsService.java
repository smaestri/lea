package lea.service;

import lea.modele.UserProfile;
import lea.modele.Utilisateur;
import lea.repository.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Service("customUserDetailsService")
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    public static List<GrantedAuthority> getGrantedAuthorities(Utilisateur user) {
        List<GrantedAuthority> authorities = new ArrayList<GrantedAuthority>();
        //TODO uncomment and refactor if several roles
        //for (UserProfile userProfile : user.getUserProfiles()) {
        authorities.add(new SimpleGrantedAuthority("ROLE_USER" /*+ userProfile.getType()*/));
        //}
        System.out.print("authorities :" + authorities);
        return authorities;
    }

    public UserDetails loadUserByUsername(String login) throws UsernameNotFoundException {

        List<Utilisateur> allUsers = userRepository.findByEmail(login);

        if (allUsers.isEmpty()) {
            System.out.println("User not found");
            throw new UsernameNotFoundException("Username not found");
        }

        Utilisateur user = allUsers.get(0);

        return new UserPrincipal(user.getFirstName(), user.getPassword(), getGrantedAuthorities(user), user);

        //return new org
        //			.springframework.security.core.userdetails.User(user.getFirstName(), user.getPassword(),
        //		 true, true, true, true, getGrantedAuthorities(null));
    }

    public static class UserPrincipal extends org.springframework.security.core.userdetails.User {

        private Utilisateur user = null;

        public UserPrincipal(String username, String password, Collection<? extends GrantedAuthority> authorities, Utilisateur user) {
            super(username, password, authorities);
            this.user = user;
        }

        public Utilisateur getUser() {
            return user;
        }
    }

}
