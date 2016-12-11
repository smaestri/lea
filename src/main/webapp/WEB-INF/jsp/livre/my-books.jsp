<%@ include file="/WEB-INF/jsp/include.jsp" %>
<t:default>
<h2>Mes livres</h2>

<div class="row">
     <c:choose>
     <c:when test="${fn:length(mesLivres) gt 0}">
        <c:forEach items="${mesLivres}" var="livre">
            <div class="col-md-2 text-center">
                <div class="bloc_book">
                    <div class="titre_book">${livre.titreBook}</div>
                    <div class="content_book">
                       <img src="${livre.image}" style="width:80px;height:110px;" />
                    </div>
                </div>
                <div class="bloc_button">
                    <a class="editBook" href="<c:url value="/livres/edit/${livre.id}" /> ">
                        <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#modal-emprunt" data-livre="${livre.id}" data-proprietaire="${livre.user.id}">Modifier</button>
                    </a>
                    <a class="deleteBook" data-livre="${livre.id}" href="#"  >
                        <button type="button" style="margin-top:5px;" class="btn btn-primary" data-toggle="modal" data-target="#modal-emprunt" data-livre="${livre.id}" data-proprietaire="${livre.user.id}">Supprimer</button>
                    </a><br/>
                </div>
            </div>
        </c:forEach>

        <form:form action="deleteBook" id="formDeleteBook" method="POST">
            <input type="hidden" id="book_id" name="book_id" value="">
        </form:form>
        </c:when>
        <c:otherwise>Vous n'avez pas d&eacute;clar&eacute; de livres.</c:otherwise>
        </c:choose>
    </div>
    <div class="row text-center" >
        <a href="livres/new"><button type="button" style="margin-top:10px;" class="btn btn-primary">Ajouter un livre</button></a><br/>
    </div>
</div>
</t:default>