package lea.service;

import javax.mail.MessagingException;
import java.io.UnsupportedEncodingException;

/**
 * Created by sylvain on 1/27/16.
 */
public interface MailService {

    public void sendEmail(String content, String object, String receiver, String sender) throws UnsupportedEncodingException, MessagingException;
}
