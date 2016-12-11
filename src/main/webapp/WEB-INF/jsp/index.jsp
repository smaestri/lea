<%@ include file="include.jsp" %>

<t:default>
    <sec:authorize access="hasRole('ANONYMOUS')">
        <div class="row">
            <div class="col-md-4 col-md-offset-4">
                <jsp:include page="display-login.jsp" />
            </div>
         </div>
         <div class="row text-center">
            <div class="col-md-2"></div>
            <div class="col-md-8">
                <h1>Bienvenue sur Livres entre Amis!</h1>
                    Ce site vous permet d'emprunter des livres entre amis, de fa&ccedil;on totalement gratuite!
                 
            </div>
            <div class="col-md-2"></div>
        </div>
    </sec:authorize>
    <sec:authorize access="hasRole('USER')">
        <div class="col-md-6">
            <div class="contentIndex">
                <h2>A la recherche d'un nouveau livre?</h2><br/>
                <ul>
                    <c:forEach var="category" items="${categories}">
                        <li><a href="searchBook?categorie=${category.id}"><c:out value="${category.libelleCat}" /></a></li>
                    </c:forEach>
                </ul>
            </div>

            <div class="contentIndex">
                <h2>Vous aimez noter site Internet? parlez-en &agrave; vos amis!</h2><br/>
            </div>
        </div>

        <div class="col-md-6">
            <div class="contentIndex">
                <h2>Les derniers avis</h2>
                <c:forEach var="avi" items="${avis}">
                    <span class="title_book">${fn:toUpperCase(avi.livre.titreBook)}</span>
                    <input class="rating-input-index" data-min="0" data-max="5" data-step="1" data-size="xxs" data-note="${avi.note}">
                    <span class="title_propretaire"><c:out value="${avi.auteur.firstName}" /></span> -
                    <span class="date_avis">le  <fmt:formatDate pattern="dd-MM-yyyy" type="date" value="${avi.dateavis}" /></span><br/>
                    <span><c:out value="${avi.libelle}" /></span>
                    <hr>
                </c:forEach>
            </div>
        </div>
    </sec:authorize>
</t:default>
