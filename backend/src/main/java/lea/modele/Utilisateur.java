package lea.modele;

import lea.commun.EmailConstraint;
import lea.commun.PasswordConstraint;
import org.springframework.data.annotation.Transient;
import org.springframework.util.StringUtils;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@PasswordConstraint(message = "{validation.password.error_password}")
@EmailConstraint(message = "{validation.email.email_already_existing}")
public class Utilisateur extends BaseDocumentImpl {

    private List<String> listEmpruntsId;
    private List<String> listPretsId;
    private List<String> listUserProfilesId = new ArrayList<String>();
    private List<String> listFriendsId = new ArrayList<String>();
    private List<PendingFriend> listPendingFriends = new ArrayList<PendingFriend>();
    private List<Livre> livres = new ArrayList<>();

    @NotNull
    @Size(min = 2, max = 14, message = "Le mot de passe doit comprendre entre 2 et 14 caractères")
    private String password;

    @Transient
    private String confirmPassword;

    @NotNull
    @Size(min = 2, max = 14, message = "Le prénom doit comprendre entre 2 et 14 caractères")
    private String firstName;

    @Size(min = 2, max = 14, message = "Le nom doit comprendre entre 2 et 14 caractères")
    private String lastName;

    @NotEmpty(message = "{validation.email.notEmpty}")
    @Email(message = "{validation.email.incorrect}")
    @Size(min = 2, max = 50, message = "{validation.email.size}")
    private String email;

    private String avatar;

    private Boolean enabled;

    @Transient
    private boolean creation;

    @Transient
    private List<Utilisateur> userFriends = new ArrayList<Utilisateur>();

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Boolean getEnabled() {
        return enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }

    public List<Livre> getLivres() {
        return livres;
    }

    public void setLivres(List<Livre> livres) {
        this.livres = livres;
    }

    public List<String> getListEmpruntsId() {
        return listEmpruntsId;
    }

    public void setListEmpruntsId(List<String> listEmpruntsId) {
        this.listEmpruntsId = listEmpruntsId;
    }

    public List<String> getListPretsId() {
        return listPretsId;
    }

    public void setListPretsId(List<String> listPretsId) {
        this.listPretsId = listPretsId;
    }

    public List<String> getListUserProfilesId() {
        return listUserProfilesId;
    }

    public void setListUserProfilesId(List<String> listUserProfilesId) {
        this.listUserProfilesId = listUserProfilesId;
    }

    public List<String> getListFriendsId() {
        return listFriendsId;
    }

    public void setListFriendsId(List<String> listFriendsId) {
        this.listFriendsId = listFriendsId;
    }

    public List<PendingFriend> getListPendingFriends() {
        return listPendingFriends;
    }

    public void setListPendingFriends(List<PendingFriend> listPendingFriends) {
        this.listPendingFriends = listPendingFriends;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public Optional<Livre> getLivre(String id) {
        for (Livre livre : this.livres) {
            if (livre.getId().equals(id)) {
                return Optional.of(livre);
            }
        }
        return Optional.empty();
    }

    @Override
    public int hashCode() {
        return 1;
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == null)
            return false;
        if (!(obj instanceof Utilisateur))
            return false;
        Utilisateur other = (Utilisateur) obj;
        if (this.email.equals(other.email)) {
            return true;
        }
        return false;
    }


    public String getFullName() {
        return StringUtils.capitalize(this.firstName) + " " + StringUtils.capitalize(this.lastName);
    }

    public String getConfirmPassword() {
        return confirmPassword;
    }

    public void setConfirmPassword(String confirmPassword) {
        this.confirmPassword = confirmPassword;
    }

    public boolean isCreation() {
        return creation;
    }

    public void setCreation(boolean creation) {
        this.creation = creation;
    }

    @Override
    public String toString() {
        return "Utilisateur{" +
                "id=" + this.getId() +
                "livres=" + livres +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", email='" + email + '\'' +
                '}';
    }

//    public void updateLivre(String id, Livre livreUpdated) {
//
//        for (Livre livre : this.livres) {
//            if (livre.getId().equals(id)) {
//                livre.setTitreBook(livreUpdated.getTitreBook());
//                livre.setAuteur(livreUpdated.getAuteur());
//            }
//        }
//    }

    public List<Utilisateur> getUserFriends() {
        return userFriends;
    }

    public void setUserFriends(List<Utilisateur> userFriends) {
        this.userFriends = userFriends;
    }

    //TODO  get direct child with adequate mongoDb query
//    public Avis getAvis(String avisId) {
//        for (Livre livre : this.livres) {
//            for (Avis avis : livre.getAvis()) {
//                if (avis.getId().equals(avisId)) {
//                    return avis;
//                }
//            }
//        }
//        return null;
//    }
}
