package lea.service;


public interface NotificationService {
    void sendNouvelEmprunt(String mailDest, String livre, String preteur, String nameDestinataire) ;

    void sendAcceptation(String email, String fullName, String titreBook, String nameDestinataire) ;

    void sendRefus(String email, String fullName, String titreBook, String motif, String nameDestinataire) ;
    void sendLivreEnvoye(String email, String fullName, String titreBook, String nameDestinataire) ;
    void sendClore(String email, String fullName, String titreBook, String nameDestinataire) ;

    void sendResetPassword(String email, String link, String nameDestinataire) ;

    void sendNewAmi(String email1, String fullName, String nameDestinataire) ;

    void sendAmiAccepted(String email, String fullName, String nameDestinataire) ;

    void confirmCommenToOther(String email, String titrebook, String auteurComm, String nameDestinataire);

    void confirmCommenToMyself(String email, String titrebook, String nameDestinataire);

    void sendNouvelEmpruntToMyself(String email, String fullName, String titreBook, String fullName1);

    void sendAcceptationToMyself(String email, String fullName, String titreBook, String fullName1);

    void sendRefusToMyself(String email, String fullName, String titreBook, String refus, String fullName1);

    void sendLivreEnvoyeToMyself(String email, String fullName, String titreBook, String fullName1);

    void sendCloreToMyself(String email, String titreBook, String fullName);

    void sendNewAmiToMyself(String email, String emailAmi, String fullName);

    void sendAmiAcceptedToMyself(String email, String email1, String fullName);

    void confirmSubscription(String email, String fullName);
}
