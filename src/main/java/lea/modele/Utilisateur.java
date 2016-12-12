package lea.modele;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.data.annotation.Id;
import org.springframework.util.StringUtils;

import javax.validation.constraints.Size;
import java.util.HashSet;
import java.util.Set;

public class Utilisateur extends BaseDocumentImpl {

    // FK
    private Set<String> listLivresId;
    private Set<String> listEmpruntsId;
    private Set<String> listPretsId;
    private Set<String> listUserProfilesId = new HashSet<String>();
    private Set<String> listFriendsId = new HashSet<String>();
    private Set<String> listPendingFriendsId = new HashSet<String>();


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

    public Boolean getEnabled() {
        return enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }

    public Set<String> getListLivresId() {
        return listLivresId;
    }

    public void setListLivresId(Set<String> listLivresId) {
        this.listLivresId = listLivresId;
    }

    public Set<String> getListEmpruntsId() {
        return listEmpruntsId;
    }

    public void setListEmpruntsId(Set<String> listEmpruntsId) {
        this.listEmpruntsId = listEmpruntsId;
    }

    public Set<String> getListPretsId() {
        return listPretsId;
    }

    public void setListPretsId(Set<String> listPretsId) {
        this.listPretsId = listPretsId;
    }

    public Set<String> getListUserProfilesId() {
        return listUserProfilesId;
    }

    public void setListUserProfilesId(Set<String> listUserProfilesId) {
        this.listUserProfilesId = listUserProfilesId;
    }

    public Set<String> getListFriendsId() {
        return listFriendsId;
    }

    public void setListFriendsId(Set<String> listFriendsId) {
        this.listFriendsId = listFriendsId;
    }

    public Set<String> getListPendingFriendsId() {
        return listPendingFriendsId;
    }

    public void setListPendingFriendsId(Set<String> listPendingFriendsId) {
        this.listPendingFriendsId = listPendingFriendsId;
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

    @Override
    public String toString() {
        return "Utilisateur{" +
                "listLivresId=" + listLivresId +
                ", listEmpruntsId=" + listEmpruntsId +
                ", listPretsId=" + listPretsId +
                ", listUserProfilesId=" + listUserProfilesId +
                ", listFriendsId=" + listFriendsId +
                ", listPendingFriendsId=" + listPendingFriendsId +
                ", password='" + password + '\'' +
                ", confirmPassword='" + confirmPassword + '\'' +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", email='" + email + '\'' +
                ", enabled=" + enabled +
                ", isEdit=" + isEdit +
                '}';
    }
}
