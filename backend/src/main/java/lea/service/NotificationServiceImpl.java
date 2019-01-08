package lea.service;

import lea.commun.MailUtils;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
@Profile({"default", "dev"})
public class NotificationServiceImpl implements NotificationService {

    public void sendNouvelEmprunt(String mailDest, String emprunteur, String livre, String nameDestinataire) {
        MailUtils.sendMail(mailDest, "Nouvelle demande d'emprunt", "Une nouvelle demande d'emprunt a été effectuée par " + emprunteur + " pour le livre " + livre + " Connectez-vous au site pour accepter ou refuser cet emprunt!", nameDestinataire);
    }

    @Override
    public void sendAcceptation(String mailDest, String preteur, String livre, String nameDestinataire) {
        MailUtils.sendMail(mailDest, "Demande d'emprunt acceptée", "Votre demande d'emprunt à" + preteur + " pour le livre " + livre + " a été acceptée Vous devriez recevoir très prochainement. Si ce n'est pas le cas, n'hésitez pas à envoyer un petit message à " + preteur + " via le site", nameDestinataire);
    }

    @Override
    public void sendRefus(String mailDest, String preteur, String livre, String motif, String nameDestinataire) {
        MailUtils.sendMail(mailDest, "Refus de la demande d'emprunt", preteur + " a refusé votre demande d'emprunt pour le livre " + livre + " avec le motif: " + motif, nameDestinataire);
    }

    @Override
    public void sendLivreEnvoye(String mailDest, String emprunteur, String livre, String nameDestinataire) {
        MailUtils.sendMail(mailDest, "Le livre a été envoyé", emprunteur + " vous a renvoyé le livre " + livre + ", que vous devriez donc recevoir rapidement! Une fois reçu, vous pourrez clore l'emprunt.", nameDestinataire);
    }

    @Override
    public void sendClore(String mailDest, String preteur, String livre, String nameDestinataire) {
        MailUtils.sendMail(mailDest, "Le prêteur a clos l'emprunt", preteur + " a clos l'emprunt. En espérant que le livre vous a plu!", nameDestinataire);
    }

    @Override
    public void sendResetPassword(String mailDest, String link, String nameDestinataire) {
        MailUtils.sendMail(mailDest, "Nouveau mot de passe", " Vous avez initié une demande de changement de mot de passe. Merci de cliquer sur ce lien pour finaliser le processus: " + link, nameDestinataire);
    }

    @Override
    public void sendNewAmi(String mailDest, String guest, String nameDestinataire) {
        MailUtils.sendMail(mailDest, "Nouvelle demande d'ami", guest + " souhaite vous ajouter en tant qu'ami sur livresentreamis.com. Connectez-vous au site ou inscrivez vous et rejoignez la communauté, afin d'échanger des livres gratuitement!", nameDestinataire);
    }

    @Override
    public void sendAmiAccepted(String email, String guest, String nameDestinataire) {
        Map<String, String> vars = new HashMap<>();
        vars.put("guest", guest);
        MailUtils.sendMail(email, "Demande d'ami acceptée", guest + " a accepté votre demande d'amitié. Connectez-vous au site pour lui emprunter des livres!", nameDestinataire);
    }
}
