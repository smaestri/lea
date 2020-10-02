package lea.controller;

import lea.modele.*;
import lea.repository.emprunt.EmpruntRepository;
import lea.repository.livremodel.MongoLivreModelRepository;
import lea.repository.user.MongoUserRepository;
import lea.repository.user.UserRepository;
import lea.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.mail.MessagingException;
import javax.servlet.ServletException;
import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.Optional;

/**
 * Created by sylvain on 30/12/16.
 */
@RestController
public class CommentController extends CommonController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MongoUserRepository mongoUserRepository;

    @Autowired
    private EmpruntRepository empruntRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private MongoLivreModelRepository mongoLivreModelRepository;

    @RequestMapping(value = "/api/comments/{empruntId}", method = RequestMethod.GET, produces = "application/json")
    public List<Commentaire> getEchanges(Model model, @PathVariable(value = "empruntId", required = true) String empruntId) throws ServletException, IOException {
        List<Commentaire> comments = empruntRepository.getCommentaires(empruntId);
        //set user author
        for (Commentaire com : comments) {
            com.setUser(this.mongoUserRepository.findById(com.getAuteur()).get());
        }
        return comments;
    }

    @RequestMapping(value = "/api/addComment/{empruntId}", method = RequestMethod.POST)
    public Commentaire addCommentaire(@PathVariable("empruntId") String empruntId, @RequestBody Commentaire commentaire) throws ServletException, IOException {
        Utilisateur principal = getPrincipal();
        Emprunt emprunt = this.empruntRepository.findOne(empruntId);
        Commentaire comm = new Commentaire();
        comm.setDateMessage(new Date());
        comm.setMessage(commentaire.getMessage());
        comm.setAuteur(principal.getId());
        comm.setUser(principal);
        emprunt.getCommentaires().add(comm);
        empruntRepository.saveEmprunt(emprunt);
        Utilisateur preteur = mongoUserRepository.findById(emprunt.getPreteurId()).get();
        Utilisateur emprunteur = mongoUserRepository.findById(emprunt.getEmprunteurId()).get();
        Optional<LivreModel> livreModel = this.mongoLivreModelRepository.findById(emprunt.getLivreModelId());
        // commentaire a moi meme dans tous les cas
        try {
            this.notificationService.confirmCommenToMyself(principal.getEmail(), livreModel.get().getTitreBook(), principal.getFullName() );
            // commentaire a lautre
            if(principal.getId().equals(preteur.getId())){
                this.notificationService.confirmCommenToOther(emprunteur.getEmail(), livreModel.get().getTitreBook(), preteur.getFullName(), emprunteur.getFullName() );
            } else {
                this.notificationService.confirmCommenToOther(preteur.getEmail(), livreModel.get().getTitreBook(), emprunteur.getFullName(), preteur.getFullName());
            }

        } catch (MessagingException e) {
            System.out.println("Erreur lors de l'envoi du mail");
        }


        return comm;
    }

    // Editer un commentaire : PUT
    @RequestMapping(value = "/api/comments/{commentId}", method = RequestMethod.PUT)
    public Commentaire editComment(@PathVariable("commentId") String commentId, @RequestBody Commentaire newComment) {
        Commentaire comment = this.empruntRepository.findComment(commentId);
        comment.setDateMessage(new Date());
        comment.setMessage(newComment.getMessage());
        empruntRepository.saveEditComment(comment);
        return comment;
    }

    // Supprimer commentaire : DELETE
    @RequestMapping(value = "/api/comments/{commentId}", method = RequestMethod.DELETE)
    public String deleteLivre(@PathVariable("commentId") String commentId) throws Exception {
        Emprunt empruntsFromCommentid = empruntRepository.findEmpruntFromCommentid(commentId);
        empruntRepository.deleteComment(commentId, empruntsFromCommentid.getId());
        return "1";
    }

}
