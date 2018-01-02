package lea.modele;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.data.annotation.*;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
public class BaseDocumentImpl  {

    /**
     * Database technical identifier of this document
     */
    @Id
    private String id;

    @CreatedBy
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String createdBy;

    @LastModifiedBy
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String lastUpdatedBy;


    @CreatedDate
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private long creationDate;

    @LastModifiedDate
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private long lastUpdateDate;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    /**
     * Gets createdBy
     *
     * @return value of createdBy
     */
    @JsonProperty
    public String getCreatedBy() {
        return createdBy;
    }

    /**
     * Sets createdBy
     *
     * @param createdBy
     */
    @JsonIgnore
    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    /**
     * Gets lastUpdateBy
     *
     * @return value of updatedBy
     */
    @JsonProperty
    public String getLastUpdatedBy() {
        return lastUpdatedBy;
    }

    /**
     * Sets lastUpdateBy
     *
     * @param lastUpdatedBy
     */
    @JsonIgnore
    public void setLastUpdatedBy(String lastUpdatedBy) {
        this.lastUpdatedBy = lastUpdatedBy;
    }

    /**
     * Gets creationDate
     *
     * @return value of creationDate
     */
    @JsonProperty
    public long getCreationDate() {
        return creationDate;
    }

    /**
     * Sets creationDate
     *
     * @param creationDate
     */
    @JsonIgnore
    public void setCreationDate(long creationDate) {
        this.creationDate = creationDate;
    }

    /**
     * Gets lastUpdateDate
     *
     * @return value of lastUpdateDate
     */
    @JsonProperty
    public long getLastUpdateDate() {
        return lastUpdateDate == 0 ? creationDate : lastUpdateDate;
    }

    /**
     * Sets lastUpdateDate
     *
     * @param lastUpdateDate
     */
    @JsonIgnore
    public void setLastUpdateDate(long lastUpdateDate) {
        this.lastUpdateDate = lastUpdateDate;
    }
}
