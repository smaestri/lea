package lea;

import org.junit.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordChecker {

    @Test
    public void testPwd() throws Exception {
        BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();
         String p = bCryptPasswordEncoder.encode("tutu");
        //String p = "$2a$10$3X96h95h.gEfNtssfQ4C4ul6dENXmWg/nLzEx7xTOG5VxHYyr5voC";
        System.out.println(p);

    }
}
