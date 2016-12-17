<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@taglib prefix="sec" uri="http://www.springframework.org/security/tags"%>

<div class="row">
    <c:choose>
    <c:when test="${fn:length(livres) gt 0}">
        <c:forEach items="${livres}" var="livre">
              <div class="col-md-2 text-center">
                 <div class="bloc_book">
                     <div class="titre_book">${livre.titreBook}</div>
                     <div class="content_book">
                         <a href="#" data-toggle="modal" data-target="#modal-livre" data-livre="${livre.id}">
                            <img src="<c:url value="${livre.image}" />" style="width:80px;height:110px;" /><br/> D&eacute;tails<br/>
                         </a>
                     </div>
                 </div>
                 <div class="bloc_button">
                   <c:if test="${livre.statut eq 'FREE'}">
                        <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#modal-emprunt" data-livre="${livre.id}" data-proprietaire="${livre.userId}">Emprunter</button>
                   </c:if>
                   <c:if test="${livre.statut ne 'FREE'}">
                      <span>Livre non <br/> empruntable </span>
                   </c:if>
                 </div>
               </div>
        </c:forEach>
    </c:when>
    <c:otherwise>Pas de r&eacute;sultats</c:otherwise>
    </c:choose>
</div>
