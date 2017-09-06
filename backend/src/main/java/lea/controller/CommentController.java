package lea.controller;

import lea.modele.Commentaire;
import lea.modele.Emprunt;
import lea.modele.Livre;
import lea.modele.Utilisateur;
import lea.repository.emprunt.EmpruntRepository;
import lea.repository.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.servlet.ServletException;
import java.io.IOException;
import java.util.Date;
import java.util.List;

/**
 * Created by sylvain on 30/12/16.
 */
@RestController
public class CommentController extends CommonController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private EmpruntRepository empruntRepository;

    @RequestMapping(value = "/api/comments/{empruntId}", method = RequestMethod.GET, produces = "application/json")
    public List<Commentaire> getEchanges(Model model, @PathVariable(value = "empruntId", required = true) String empruntId) throws ServletException, IOException {
        List<Commentaire> comments = empruntRepository.getCommentaires(empruntId);
        //set user author
        for(Commentaire com : comments){
            com.setUser(this.userRepository.findOne(com.getAuteur()));
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
