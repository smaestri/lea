package lea;

import lea.service.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.authentication.rememberme.JdbcTokenRepositoryImpl;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private CustomUserDetailsService userService;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            // to uncomment
            //.csrf().disable()
            .authorizeRequests()
                .antMatchers("/users/new").permitAll()
                .antMatchers("/webjars/**").permitAll()
                .antMatchers("favicon.ico").permitAll()
                .antMatchers("/home").permitAll()
                .antMatchers("/").permitAll()
                .antMatchers("/api/searchBook").permitAll()
                .antMatchers("/api/getLastAvis").permitAll()
                .antMatchers("/contact").permitAll()
                .antMatchers("/faq").permitAll()
                .antMatchers("/info").permitAll()
                .antMatchers("/camarche").permitAll()
                .antMatchers("/api/getCategories").permitAll()
                .antMatchers("/api/userInfo/**").permitAll() // Tto ger avis 's user
                .anyRequest().authenticated()
                .and()
            .formLogin()
                .loginPage("/login")
                .permitAll()
                .and()
            .logout()
                .permitAll()
        .and().rememberMe().rememberMeParameter("remember-me").key("tutu").tokenValiditySeconds(86400);
    }

    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(this.userService);

    }
}
