<%@ include file="/WEB-INF/jsp/include.jsp" %>
<t:default>
	<h2 class="title_bloc">Mon compte</h2>

	<div class="row">
		<div class="col-md-3">
			<ul id="menuAccount" class="nav nav-pills nav-stacked">
                <li class="active"><a id="linkProfil" href="#">Profil</a></li>
				<li><a id="linkHistoriqueEmprunt" href=".">Historique des emprunts</a></li>
				<li><a id="linkHistoriquePret" href=".">Historique des pr&ecirc;ts</a></li>
			</ul>
		</div>

		<div class="col-md-9">
			<div id="contentHistoriqueEmprunt" style="display:none">
				<h3>Mes emprunts histori&eacute;s</h3>
				<c:choose>
					<c:when test="${fn:length(empruntsHistories) gt 0}">
						<c:set var="displayBoutton" value="false" scope="request" />
						<c:set var="emprunts" value="${empruntsHistories}" scope="request" />
						<jsp:include page="../macro/display-emprunt.jsp" />
					</c:when>
					<c:otherwise>Pas de pr&ecirc;ts histori&eacute;s</c:otherwise>
				</c:choose>
			</div>

			<div id="contentHistoriquePret" style="display:none">
				<h3>Mes pr&ecirc;ts histori&eacute;s</h3>
				<c:choose>
					<c:when test="${fn:length(pretsHistories) gt 0}">
						<c:set var="displayBoutton" value="false" scope="request" />
						<c:set var="prets" value="${pretsHistories}" scope="request" />
						<jsp:include page="../macro/display-pret.jsp" />
					</c:when>
					<c:otherwise>Pas de pr&ecirc;ts en cours</c:otherwise>
				</c:choose>
			</div>

			<div id="contentProfil" style="display:none">
				<h3>Mon profil </h3>
				<form:form action="users/edit" modelAttribute="utilisateur" method="POST">
					<div class="error"><form:errors path="*" cssClass="error" /></div>
					<div class="form-group">
						<form:hidden path="email"  />
						<form:hidden path="id"/>
						<label for="lastName" class="col-sm-2 form-control-label">Nom</label>
						<div class="col-sm-10" style="margin-bottom: 10px;">
						    <form:input path="lastName" cssClass="form-control" placeholder="Votre nom" />
						</div>
					</div>
				</form:form>
			</div>

		</div>
	</div>
</t:default>