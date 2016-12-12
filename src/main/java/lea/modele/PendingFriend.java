package lea.modele;

import java.io.Serializable;

public class PendingFriend extends BaseDocumentImpl implements Serializable {

    // FK
    private String userId;

    private String email;

    private Boolean actif;


    public PendingFriend(String email) {
        this.email = email;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public Boolean getActif() {
        return actif;
    }

    public Boolean isActif() {
        return actif;
    }

    public void setActif(Boolean actif) {
        this.actif = actif;
    }

    @Override
    public String toString() {
        return "PendingFriend{" +
                "userId='" + userId + '\'' +
                ", email='" + email + '\'' +
                ", actif=" + actif +
                '}';
    }
}
