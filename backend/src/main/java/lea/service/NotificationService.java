package lea.service;


import javax.mail.MessagingException;

public interface NotificationService {
    void sendNouvelEmprunt(String mailDest, String livre, String preteur, String nameDestinataire) throws MessagingException;

    void sendAcceptation(String email, String fullName, String titreBook, String nameDestinataire) throws MessagingException;

    void sendRefus(String email, String fullName, String titreBook, String motif, String nameDestinataire) throws MessagingException;
    void sendLivreEnvoye(String email, String fullName, String titreBook, String nameDestinataire) throws MessagingException;
    void sendClore(String email, String fullName, String titreBook, String nameDestinataire) throws MessagingException;

    void sendResetPassword(String email, String link, String nameDestinataire) throws MessagingException;

    void sendNewAmi(String email1, String fullName, String nameDestinataire) throws MessagingException;

    void sendAmiAccepted(String email, String fullName, String nameDestinataire) throws MessagingException;

    void confirmCommenToOther(String email, String titrebook, String auteurComm, String nameDestinataire) throws MessagingException;

    void confirmCommenToMyself(String email, String titrebook, String nameDestinataire) throws MessagingException;

    void sendNouvelEmpruntToMyself(String email, String fullName, String titreBook, String fullName1) throws MessagingException;

    void sendAcceptationToMyself(String email, String fullName, String titreBook, String fullName1) throws MessagingException;

    void sendRefusToMyself(String email, String fullName, String titreBook, String refus, String fullName1) throws MessagingException;

    void sendLivreEnvoyeToMyself(String email, String fullName, String titreBook, String fullName1) throws MessagingException;

    void sendCloreToMyself(String email, String titreBook, String fullName) throws MessagingException;

    void sendNewAmiToMyself(String email, String emailAmi, String fullName) throws MessagingException;

    void sendAmiAcceptedToMyself(String email, String email1, String fullName) throws MessagingException;

    void confirmSubscription(String email, String fullName) throws MessagingException;
}
