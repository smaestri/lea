package lea.configuration.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.security.web.authentication.logout.HttpStatusReturningLogoutSuccessHandler;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
@ComponentScan("lea.configuration")
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private CustomUserDetailsService userService;

    @Autowired
    private CustomAccessDeniedHandler accessDeniedHandler;

    @Autowired
    private RestAuthenticationEntryPoint restAuthenticationEntryPoint;

    @Autowired
    private MySavedRequestAwareAuthenticationSuccessHandler mySuccessHandler;



    private SimpleUrlAuthenticationFailureHandler myFailureHandler = new SimpleUrlAuthenticationFailureHandler();


    @Override
    protected void configure(HttpSecurity http) throws Exception {

        http
            .csrf().disable()
            .exceptionHandling()
            .authenticationEntryPoint(restAuthenticationEntryPoint)
            .and()
            .authorizeRequests()
            .antMatchers("/webjars/**").permitAll()
            .antMatchers("/favicon.ico").permitAll()
            .antMatchers("/home").permitAll()
            .antMatchers("/").permitAll()
            .antMatchers("/users/new/**").permitAll()
            .antMatchers("/api/searchBook").permitAll()
            .antMatchers("/api/getLastAvis").permitAll()
            .antMatchers("/contact").permitAll()
            .antMatchers("/users/resetPwd").permitAll()
            .antMatchers("/users/changePassword").permitAll()
            .antMatchers("/getPwdEncoded").permitAll()
            .antMatchers("/api/getCategories").permitAll()
            .antMatchers("/api/livres/**").permitAll()
            .antMatchers("/api/userInfo/**").permitAll()
            .antMatchers("/api/editUser/**").authenticated()
            .antMatchers("/api/createUser/**").permitAll()
            .antMatchers("/api/isAuthenticated/**").permitAll() // To know if user is connected
            .antMatchers("/testenvoi/**").permitAll() // To know if user is connected
            .anyRequest().authenticated()
            .antMatchers("/users/updatePassword*",
                    "/users/savePassword*",
                    "/users/updatePassword*")
            .hasAuthority("CHANGE_PASSWORD_PRIVILEGE")
            .and()
            .formLogin()
            .successHandler(mySuccessHandler)
            .failureHandler(myFailureHandler)
            .and()
            .logout()
            .logoutSuccessHandler((new HttpStatusReturningLogoutSuccessHandler(HttpStatus.OK)));
    }

    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(this.userService).passwordEncoder(passwordEncoder());
    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        PasswordEncoder encoder = new BCryptPasswordEncoder();
        return encoder;
    }

//    @Bean
//    public SavedRequestAwareAuthenticationSuccessHandler successHandler() {
//        SavedRequestAwareAuthenticationSuccessHandler successHandler = new SavedRequestAwareAuthenticationSuccessHandler();
//        successHandler.setTargetUrlParameter("/succeslogin");
//        return successHandler;
//    }
}
