<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<jsp:include page="modal-livre.jsp" />
<jsp:include page="modal-emprunt.jsp" />
<c:set var="source" value="emprunts" scope="request"  />
<jsp:include page="modal-echange.jsp" />
<jsp:include page="modal-avis.jsp" />
<c:forEach items="${emprunts}" var="emprunt">
    <div class="row" style="margin-top: 10px">
        <div class="col-md-2 text-center">
            <a href="#" data-toggle="modal" data-target="#modal-livre" data-livre="${emprunt.livre.id}">
                <img src="${emprunt.livre.image}" style="width:80px;height:110px;" />
            </a>
        </div>
        <div class="col-md-6">
            <div class="row">
                <span class="titre_book">
                    <a href="#" data-toggle="modal" data-target="#modal-livre" data-livre="${emprunt.livre.id}">
                        <c:out value="${emprunt.livre.titreBook}" />
                    </a>
                </span><br/>
                Appartient &agrave; : <c:out value="${emprunt.preteur.fullName}" /><c:if test="${not empty emprunt.intermediaire}">(Ami de ${emprunt.intermediaire})</c:if><br/>
                Statut : <spring:message code="${emprunt.livre.statut}" /> <br />
                <!-- Emprunt refusé-->
                <c:if test="${not empty emprunt.motifRefus}"> Cet emprunt a &eacutet&eacute refus&eacute. Motif : <c:out value="${emprunt.motifRefus}" /><br/></c:if>
                <br/>
            </div>
        </div>
        <div class="col-md-4">
            <div style="margin-bottom: 10px; margin-top: 20px">
                <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#modal-echange" data-emprunt="${emprunt.id}">Communiquer avec le pr&ecirc;teur</button>
            </div>
            <c:if test="${emprunt.livre.statut eq 'CURRENT' && displayBoutton eq 'true'}">
                <div style="margin-bottom: 10px"><button class="btn btn-primary envoyerEmpruntBtn" data-book="${emprunt.livre.id}" data-emprunt="${emprunt.id}">Renvoyer le livre</button></div>
            </c:if>
            <c:if test="${emprunt.livre.statut eq 'CURRENT' || displayBoutton ne 'true'}">
                <div style="margin-bottom: 10px"><button class="btn btn-primary" data-toggle="modal" data-target="#modal-avis" data-titre="${emprunt.livre.titreBook}" data-livre="${emprunt.livre.id}">Ajouter un avis pour ce livre</button></div>
            </c:if>
        </div>
    </div>
</c:forEach>
</table>