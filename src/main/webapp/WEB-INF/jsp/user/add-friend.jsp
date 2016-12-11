<%@ include file="/WEB-INF/jsp/include.jsp" %>
<t:default>
	<h2 class="title_bloc">Ajouter un ami</h2>
	 <div class="row">
         <form:form action="ami/new" modelAttribute="ami" method="POST" id="addFriendForm">
            <div class="col-md-3"></div>
            <div class="col-md-6">
                <div class="error row"><form:errors path="*" cssClass="error" /></div>
                <span>Veuillez entrer l'email de l'ami que vous voulez ajouter. Une demande lui sera faite et vous pourrez consulter ses livres une fois qu'il aura accept&eacute; votre demande!</span>
                <div class="form-group">
                    <label for="email1" class="col-sm-3 form-control-label">Email Ami</label>
                    <div class="col-sm-9"  style="margin-bottom: 10px">
                        <form:input path="email1" cssClass="form-control" />
                    </div>
                </div>
                <div class="row text-center">
                    <button type="submit" onclick="this.disabled=true;this.value='Sending, please wait...';this.form.submit();"  class="btn btn-primary" >Ajouter cet ami</button>
                </div>
            </div>
            <div class="col-md-3"></div>
        </form:form>
    </div>
</t:default>