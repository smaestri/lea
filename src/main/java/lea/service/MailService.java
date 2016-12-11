package lea.service;

import javax.mail.MessagingException;
import java.io.UnsupportedEncodingException;

/**
 * Created by sylvain on 1/27/16.
 */
public interface MailService {

    public void sendEmail(String contenu, String destinataire, String subject) throws UnsupportedEncodingException, MessagingException;
}
