package lea.modele;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.data.annotation.Id;
import org.springframework.util.StringUtils;

import javax.validation.constraints.Size;
import java.util.HashSet;
import java.util.Set;

public class Utilisateur {

    @Id
    protected String id;

    @Size(min = 2, max = 14, message = "Le mot de passe doit comprendre entre 2 et 14 caractères")
    private String password;

    private String confirmPassword;

    @Size(min = 2, max = 14, message = "Le prénom doit comprendre entre 2 et 14 caractères")
    private String firstName;

    @Size(min = 2, max = 14, message = "Le nom doit comprendre entre 2 et 14 caractères")
    private String lastName;

    @Size(min = 2, max = 25, message = "L'email doit comprendre entre 2 et 25 caractères")
    private String email;

    private Boolean enabled;

    @JsonIgnore
    private Set<Livre> livres;

    @JsonIgnore
    private Set<Emprunt> emprunts;

    @JsonIgnore
    private Set<Emprunt> prets;

    @JsonIgnore
    private Set<UserProfile> userProfiles = new HashSet<UserProfile>();

    @JsonIgnore
    private Set<Utilisateur> userFriends = new HashSet<Utilisateur>();

    @JsonIgnore
    private Set<PendingFriend> emailUsers = new HashSet<PendingFriend>();

    private boolean isEdit = false;

    public boolean isEdit() {
        return isEdit;
    }

    public void setEdit(boolean edit) {
        isEdit = edit;
    }

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

    public Set<UserProfile> getUserProfiles() {
        return userProfiles;
    }

    public void setUserProfiles(Set<UserProfile> userProfiles) {
        this.userProfiles = userProfiles;
    }

    public Boolean getEnabled() {
        return enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }

    public Set<Livre> getLivres() {
        return livres;
    }

    public void setLivres(Set<Livre> livres) {
        this.livres = livres;
    }

    public Set<Emprunt> getEmprunts() {
        return emprunts;
    }

    public void setEmprunts(Set<Emprunt> emprunts) {
        this.emprunts = emprunts;
    }

    public Set<Emprunt> getPrets() {
        return prets;
    }

    public void setPrets(Set<Emprunt> prets) {
        this.prets = prets;
    }

    public Set<Utilisateur> getUserFriends() {
        return userFriends;
    }

    public void setUserFriends(Set<Utilisateur> userFriends) {
        this.userFriends = userFriends;
    }

    public Set<PendingFriend> getEmailUsers() {
        return emailUsers;
    }

    public void setEmailUsers(Set<PendingFriend> emailUsers) {
        this.emailUsers = emailUsers;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    @Override
    public String toString() {
        return "User [id=" + id + ", password=" + password
                + ", firstName=" + firstName + ", lastName=" + lastName
                + ", email=" + email + ", userProfiles=" /*+ userProfiles + "]"*/;
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
}
