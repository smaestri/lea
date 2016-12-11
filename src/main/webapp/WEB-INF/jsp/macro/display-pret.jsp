<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<c:set var="source" value="prets" scope="request"  />
<jsp:include page="modal-echange.jsp" />
<jsp:include page="modal-refus.jsp" />
<jsp:include page="modal-livre.jsp" />
<c:forEach items="${prets}" var="pret">
    <div class="row">
        <div class="col-md-2">
            <img src="<c:url value="${pret.livre.image}" />"  style="width:80px;height:110px;" />
        </div>
        <div class="col-md-6">
           <div class="row">
                <span class="titre_book">
                 <a href="#" data-toggle="modal" data-target="#modal-livre" data-livre="${pret.livre.id}">
                        <c:out value="${pret.livre.titreBook}" />
                </a>
                 </span><br/>
                Emprunteur :  <c:out value="${pret.emprunteur.fullName}" /> <c:if test="${not empty pret.intermediaire}">(Ami de ${pret.intermediaire})</c:if><br/>
                Statut :<spring:message code="${pret.livre.statut}" /> <br />
                <c:if test="${not empty pret.motifRefus}"> Cet emprunt a &eacutet&eacute refus&eacute. Motif : <c:out value="${pret.motifRefus}" /><br/></c:if>
            </div>
        </div>
        <div class="col-md-4">
            <div style="margin-bottom: 10px; margin-top: 20px">
                <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#modal-echange" data-emprunt="${pret.id}">Communiquer avec l'emprunteur</button>
            </div>
            <c:if test="${displayBoutton eq 'true'}">
                <c:choose>
                    <c:when test="${pret.livre.statut eq 'SENT' }">
                        <div style="margin-bottom: 10px">
                            <button class="btn btn-primary cloreEmpruntBtn" data-emprunt="${pret.id}">Clore cet emprunt</button>
                        </div>
                    </c:when>
                    <c:when test="${pret.livre.statut eq 'REQUESTED' }">
                        <div style="margin-bottom: 10px">
                            <button class="btn btn-primary accepterEmpruntBtn" data-emprunt="${pret.id}">Accepter l'emprunt</button>
                        </div>
                        <div style="margin-bottom: 10px">
                            <button class="btn btn-primary refuserEmpruntBtn" data-toggle="modal" data-target="#modal-refus" data-emprunt="${pret.id}">Refuser l'emprunt</button>
                        </div>
                    </c:when>
                </c:choose>
            </c:if>
        </div>
    </div>
</c:forEach>