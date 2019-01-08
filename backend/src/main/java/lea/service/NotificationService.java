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
}
