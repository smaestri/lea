package lea.service;

import org.springframework.mail.MailException;

public interface NotificationService {
    void sendNotificaition(String mailDest, String subject, String text) throws MailException, InterruptedException;

}
