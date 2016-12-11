<%@ include file="/WEB-INF/jsp/include.jsp" %>
<t:default>
	<h2 class="title_bloc">Ajouter un livre</h2>

    <div class="row">
       <div class="col-md-3" id="injectImage"></div>
	    <form:form action="livres/new" modelAttribute="livre" method="POST">
	      <div class="col-md-7">
            <div class="error row"><form:errors path="*" cssClass="error" /></div>
            <div row style="margin-bottom: 10px;">
                Veuillez saisir l'ISBN ci-dessous afin de remplir automatiquement l'image du livre <br/>
                Vous pouvez facilement trouver l'ISBN (10 caract&egrave;res) de votre livre) en allant sur la page du livre sur le site Amazon.com.<br/>
                Les champs avec * sont obligatoires.
            </div>
            <div class="form-group">
                <label for="isbn" class="col-sm-2 form-control-label">ISBN</label>
                <div class="col-sm-10" style="margin-bottom: 10px;">
                    <form:input path="isbn" cssClass="form-control" />
                </div>
            </div>
            <div class="form-group">
                <label for="titreBook" class="col-sm-2 form-control-label">Titre*</label>
                <div class="col-sm-10" style="margin-bottom: 10px;">
                    <form:input path="titreBook" cssClass="form-control" />
                </div>
            </div>
            <div class="form-group">
                <label for="description" class="col-sm-2 form-control-label">Auteur*</label>
                <div class="col-sm-10" style="margin-bottom: 10px;">
                    <form:input path="auteur" cssClass="form-control" />
                </div>
            </div>
            <div class="form-group" style="margin-bottom: 10px;">
                <label for="Editeur" class="col-sm-2 form-control-label">Editeur</label>
                <div class="col-sm-10" style="margin-bottom: 10px;">
                    <form:input path="editeur" cssClass="form-control" />
                </div>
            </div>
            <div class="form-group">
                <label for="description" class="col-sm-2 form-control-label">Description</label>
                <div class="col-sm-10" style="margin-bottom: 10px;">
                    <form:input path="description" cssClass="form-control" />
                </div>
            </div>
            <div class="form-group" style="margin-bottom: 10px;">
                <label for="categorie.id" class="col-sm-2 form-control-label">Cat&eacute;gorie*</label>
                <div class="col-sm-10" style="margin-bottom: 10px;">
                    <form:select path="categorie.id" cssClass="form-control">
                        <form:option value="">&nbsp;</form:option>
                        <form:options items="${categories}" itemValue="id" itemLabel="libelleCat"/>
                    </form:select>
                 </div>
            </div>

            <form:hidden path="id"/>
            <form:hidden path="image"/>
            <div class="row text-center">
                <button type="submit" class="btn btn-primary" >Sauvegarder</button>
            </div>
        	<div class="col-sm-2"></div>
		  </div>
	    </form:form>
    </div>
</t:default>