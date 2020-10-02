package lea.service;

import lea.commun.MailUtils;
import org.apache.commons.lang3.StringEscapeUtils;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;

@Service
public class NotificationServiceImpl implements NotificationService {

    public void sendNouvelEmprunt(String mailDest, String emprunteur, String livre, String nameDestinataire) throws MessagingException {
        MailUtils.sendMail(mailDest, "Nouvelle demande d'emprunt", "Une nouvelle demande d'emprunt a été effectuée par " + emprunteur + " pour le livre '" + StringEscapeUtils.unescapeHtml4(livre) + "'. Connectez-vous au site pour accepter ou refuser cet emprunt!", nameDestinataire);
    }

    @Override
    public void sendNouvelEmpruntToMyself(String email, String fullName, String titreBook, String nameDest) throws MessagingException {
        MailUtils.sendMail(email, "Nouvelle demande d'emprunt effectuée","L'emprunt pour le livre '" + StringEscapeUtils.unescapeHtml4(titreBook) +  "' a bien été demandé à " + fullName +".", nameDest);
    }

    @Override
    public void sendAcceptationToMyself(String email, String fullName, String titreBook, String nameDest) throws MessagingException {
        MailUtils.sendMail(email, "Vous avez accepté un emprunt", "Votre avez accepté l'emprunt de " + fullName + " pour le livre '" + StringEscapeUtils.unescapeHtml4(titreBook) + "'. Merci.", nameDest);
    }

    @Override
    public void sendAcceptation(String mailDest, String preteur, String livre, String nameDestinataire) throws MessagingException {
        MailUtils.sendMail(mailDest, "Demande d'emprunt acceptée", "Votre demande d'emprunt pour le livre '" + StringEscapeUtils.unescapeHtml4(livre) + "' a été acceptée par " + preteur +". Vous devriez le recevoir très prochainement. Si ce n'est pas le cas, n'hésitez pas à envoyer un petit message à " + preteur + " via le site!", nameDestinataire);
    }

    @Override
    public void sendRefus(String mailDest, String preteur, String livre, String motif, String nameDestinataire) throws MessagingException {
        MailUtils.sendMail(mailDest, "Refus de la demande d'emprunt", preteur + " a refusé votre demande d'emprunt pour le livre " + StringEscapeUtils.unescapeHtml4(livre) + " avec le motif: " + motif, nameDestinataire);
    }

    @Override
    public void sendRefusToMyself(String mailDest, String emprunteur, String livre, String motif, String nameDestinataire) throws MessagingException {
        MailUtils.sendMail(mailDest, "Vous avez refusé un emprunt", " Votre refus de l'emprunt pour le livre " + StringEscapeUtils.unescapeHtml4(livre) + " effectuée par " + emprunteur +" a bien été prise en compte avec le motif: " + motif, nameDestinataire);
    }

    @Override
    public void sendLivreEnvoye(String mailDest, String emprunteur, String livre, String nameDestinataire) throws MessagingException {
        MailUtils.sendMail(mailDest, "Le livre a été envoyé", emprunteur + " vous a renvoyé le livre '" + StringEscapeUtils.unescapeHtml4(livre) + "', que vous devriez donc recevoir rapidement! Une fois reçu, vous pourrez clore l'emprunt.", nameDestinataire);
    }

    @Override
    public void sendLivreEnvoyeToMyself(String mailDest, String preteur, String livre, String nameDestinataire) throws MessagingException {
        MailUtils.sendMail(mailDest, "Vous avez renvoyé le livre",  "Vous avez renvoyé le livre '" + StringEscapeUtils.unescapeHtml4(livre) + "' appartenant à " + preteur +" , merci.", nameDestinataire);
    }

    @Override
    public void sendClore(String mailDest, String preteur, String livre, String nameDestinataire) throws MessagingException {
        MailUtils.sendMail(mailDest, "Le prêteur a clos l'emprunt", preteur + " a clos l'emprunt pour le livre '" + StringEscapeUtils.unescapeHtml4(livre) + "'. En espérant que le livre vous a plu!", nameDestinataire);
    }

    @Override
    public void sendCloreToMyself(String mailDest, String livre, String nameDestinataire) throws MessagingException {
        MailUtils.sendMail(mailDest, "Vous avez clos l'emprunt",  " Vous avez bien clos l'emprunt pour le livre '" + StringEscapeUtils.unescapeHtml4(livre) + "'.", nameDestinataire);
    }

    @Override
    public void sendResetPassword(String mailDest, String link, String nameDestinataire) throws MessagingException {
        MailUtils.sendMail(mailDest, "Nouveau mot de passe", " Vous avez initié une demande de changement de mot de passe. Merci de cliquer sur ce lien pour finaliser le processus: " + link, nameDestinataire);
    }

    @Override
    public void sendNewAmi(String mailDest, String guest, String nameDestinataire) throws MessagingException {
        MailUtils.sendMail(mailDest, "Nouvelle demande d'ami", guest + " souhaite vous ajouter en tant qu'ami sur livresentreamis.com. Connectez-vous au site ou inscrivez vous et rejoignez la communauté, afin d'échanger des livres gratuitement!", nameDestinataire);
    }

    @Override
    public void sendNewAmiToMyself(String mailDest, String emailAmi, String nameDestinataire) throws MessagingException {
        MailUtils.sendMail(mailDest, "Vous avez ajouté un ami",  " Vous avez ajouté l'ami suivant " + emailAmi+ ". Il a été informé par mail, merci d'attendre qu'il s'inscrive afin d'échanger des livres avec cette personne!", nameDestinataire);
    }

    @Override
    public void sendAmiAccepted(String email, String guest, String nameDestinataire) throws MessagingException {
        MailUtils.sendMail(email, "Demande d'ami acceptée", guest + " a accepté votre demande d'amitié. Connectez-vous au site pour lui emprunter des livres!", nameDestinataire);
    }

    @Override
    public void sendAmiAcceptedToMyself(String email, String guest, String nameDestinataire) throws MessagingException {
        MailUtils.sendMail(email, "Vous avez accepté un ami", "Vous avez bien accepté l'ami " + guest +". Vous pouvez à présent échanger des livres avec cette personne!", nameDestinataire);
    }

    @Override
    public void confirmSubscription(String email, String fullName) throws MessagingException {
        MailUtils.sendMail(email, "Bienvenue sur Livresentreamis.com!", "Votre inscription sur Livresentreamis.com a bien été prise en compte. Merci.", fullName);
    }

    @Override
    public void confirmCommenToOther(String email, String book, String  auteurComm , String nameDestinataire) throws MessagingException {
        MailUtils.sendMail(email, "Nouveau commentaire sur emprunt",auteurComm + " a saisi un nouveau commentaire pour l'emprunt du livre '" +  StringEscapeUtils.unescapeHtml4(book) + "'.  Connectez-vous au site pour découvrir ce commentaire!", nameDestinataire);
    }

    @Override
    public void confirmCommenToMyself(String email, String book, String nameDestinataire) throws MessagingException {
        MailUtils.sendMail(email, "Votre  nouveau commentaire a bien été pris en compte","Votre commentaire sur l'emprunt de '" +  StringEscapeUtils.unescapeHtml4(book) + "' a bien été pris en compte. Connectez-vous au site dans la section emprunt!", nameDestinataire);
    }


}
