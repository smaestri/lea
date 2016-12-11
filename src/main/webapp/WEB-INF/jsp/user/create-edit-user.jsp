<%@ include file="/WEB-INF/jsp/include.jsp" %>
<t:default>
	<h2>Inscription</h2>
    <div class="row">
     <div class="col-md-3"></div>
     <div class="col-md-6">
		<form:form modelAttribute="utilisateur" method="POST">
            <div class="error row"><form:errors path="*" cssClass="error" /></div>

            <div class="form-group">
                <label for="email" class="col-sm-2 form-control-label">Email</label>
                <div class="col-sm-10" style="margin-bottom: 10px;">
                    <form:input path="email" cssClass="form-control" placeholder="Votre e-mail" />
                </div>
            </div>
		
			<div class="form-group">
				<label for="lastName" class="col-sm-2 form-control-label">Nom</label>
				<div class="col-sm-10" style="margin-bottom: 10px;">
				    <form:input path="lastName" cssClass="form-control" placeholder="Votre nom" />
				</div>
			</div>

			<div class="form-group">
                <label for="firstName" class="col-sm-2 form-control-label">Pr&eacute;nom</label>
                <div class="col-sm-10" style="margin-bottom: 10px;">
                    <form:input path="firstName" cssClass="form-control" placeholder="Votre prénom" />
                </div>
			</div>

			<div class="form-group">
				<label for="password" class="col-sm-2 form-control-label">Password</label>
				<div class="col-sm-10" style="margin-bottom: 10px;">
				    <form:input path="password" type="password" cssClass="form-control" placeholder="Password" />
				</div>
			</div>

            <div class="form-group">
                <label for="password" class="col-sm-2 form-control-label">Confirmer Password</label>
                <div class="col-sm-10" style="margin-bottom: 10px;">
                    <form:input path="confirmPassword" type="password" cssClass="form-control" placeholder="Password" />
                </div>
            </div>

            <div class ="row text-center">
			    <button type="submit" class="btn btn-default">Valider</button>
			    <a href="<c:url value="/" />"><button type="button" class="btn btn-default">Retour</button></a>
            </div>

		</form:form>
		</div>
       <div class="col-md-3"></div>
    </div>
</t:default>