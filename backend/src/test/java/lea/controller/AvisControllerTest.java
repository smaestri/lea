package lea.controller;

import com.google.gson.Gson;
import lea.dto.AvisBean;
import lea.modele.Avis;
import lea.modele.Livre;
import lea.modele.Utilisateur;
import lea.repository.user.UserRepository;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.mockito.BDDMockito.given;
import static org.mockito.Matchers.*;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@WebMvcTest(AvisController.class)
public class AvisControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserRepository repo;

    private Utilisateur setupUserWithBook(){
        List<Livre> books = new ArrayList<>();
        books.add(new Livre());
        Utilisateur myUser = new Utilisateur();
        myUser.setLivres(books);
        return myUser;
    }

    private Utilisateur setupUserWithBookAndAvis(){
        List<Livre> books = new ArrayList<>();
        Livre livre = new Livre();
        Avis avis = new Avis();
        avis.setId("1");
        avis.setNote(1);
        avis.setLibelle("naz");
        List listAvis = new ArrayList();
        listAvis.add(avis);
        livre.setAvis(listAvis);
        books.add(livre);
        Utilisateur myUser = new Utilisateur();
        myUser.setEmail("toto");
        myUser.setLivres(books);
        return myUser;
    }

    @Test
    @WithMockUser
    public void addavis() throws Exception {
        // given
        given(repo.findproprietaire(anyString())).willReturn(setupUserWithBook());
        AvisBean anObject = new AvisBean();
        anObject.setNote(3);
        anObject.setLibelle("toto");
        Gson gson = new Gson();
        String json = gson.toJson(anObject);

        // when
        this.mockMvc.perform(
                post("/api/avis/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk())
                .andReturn();

        // then
        verify(repo).findproprietaire(anyString());
        verify(repo).saveUser(anyObject());
    }

    @Ignore
    @Test
    @WithMockUser
    public void updateavis() throws Exception {
        // given
        Utilisateur utilisateur = setupUserWithBookAndAvis();
        given(repo.findproprietaire(anyString())).willReturn(utilisateur);
        String newLibelle = "toto";
        int newNote = 3;
        AvisBean anObject = new AvisBean();
        anObject.setNote(newNote);
        anObject.setLibelle(newLibelle);
        Gson gson = new Gson();
        String json = gson.toJson(anObject);

        // when
        this.mockMvc.perform(
                put("/api/avis/1/2")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andReturn();

        // then
        ArgumentCaptor<Utilisateur> argument = ArgumentCaptor.forClass(Utilisateur.class);
        verify(repo).findproprietaire(anyString());
        verify(repo).saveUser(argument.capture());
        Avis avis = argument.getValue().getLivres().get(0).getAvis().get(0);
        assertEquals(newNote, avis.getNote());
        assertEquals(newLibelle, avis.getLibelle());
    }
}
