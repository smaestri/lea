package lea.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
@Profile({"default"})
public class NotificationServiceImpl implements NotificationService {

    private JavaMailSender javaMailSender;

    @Autowired
    public NotificationServiceImpl(JavaMailSender javaMailSender){
        this.javaMailSender = javaMailSender;
    }

    @Async
    public void sendNotificaition(String mailDest, String subject, String text) throws MailException, InterruptedException {
       System.out.println("Sleeping now...");
       System.out.println("Sending email...");
       SimpleMailMessage mail = new SimpleMailMessage();
       mail.setTo(mailDest);
       mail.setFrom("livresentreamis5@gmail.com");
       mail.setSubject(subject);
       mail.setText(text);
       javaMailSender.send(mail);
       System.out.println("Email Sent!");
    }

}
