package lea.service;

import org.springframework.stereotype.Component;

import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.io.UnsupportedEncodingException;
import java.util.Properties;

/**
 * Created by sylvain on 1/27/16.
 */
@Component("realMail")
public class MailServiceImpl implements MailService {

    public void sendEmail(String contenu, String destinataire, String subject) throws UnsupportedEncodingException, MessagingException {

        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", "smtp.gmail.com");
        props.put("mail.smtp.port", "587");

        Session session = Session.getInstance(props,
                new javax.mail.Authenticator() {
                    protected PasswordAuthentication getPasswordAuthentication() {
                        return new PasswordAuthentication("livresentreamis5@gmail.com", "maestro29");
                    }
                });

        MimeMessage msg = new MimeMessage(session);
        msg.setFrom(new InternetAddress("livresentreamis5@gmail.com", "Livres entre Amis"));
        msg.addRecipient(Message.RecipientType.TO,
                new InternetAddress(destinataire, ""));
        msg.setSubject(subject, "UTF-8");
        msg.setText(contenu, "UTF-8");
        msg.setHeader("Content-Type", "text/plain; charset=UTF-8");

        Transport.send(msg);
    }
}
