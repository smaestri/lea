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
@Component("mockMail")
public class MockMailServiceImpl implements MailService {

    public void sendEmail(String contenu, String object, String receiver, String sender) throws UnsupportedEncodingException, MessagingException {

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

        Message msg = new MimeMessage(session);
        msg.setFrom(new InternetAddress("livresentreamis5@gmail.com", "Livres entre Amis"));
        msg.addRecipient(Message.RecipientType.TO,
                new InternetAddress("sylvainmaestri@gmail.com", ""));
        msg.setSubject(object);
        msg.setText(contenu);
        Transport.send(msg);


    }
}
