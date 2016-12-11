<%@ include file="/WEB-INF/jsp/include.jsp" %>
<jsp:include page="/WEB-INF/jsp/macro/modal-livre.jsp" />
<jsp:include page="/WEB-INF/jsp/macro/modal-emprunt.jsp" />
<t:default>
    <h2 class="title_bloc modal-title">R&eacute;sultat de la recherche</h2>
    <jsp:include page="../macro/display-books.jsp" />
</t:default>