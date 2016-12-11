<%@ include file="/WEB-INF/jsp/include.jsp" %>
<jsp:include page="/WEB-INF/jsp/macro/modal-livre.jsp" />
<jsp:include page="/WEB-INF/jsp/macro/modal-emprunt.jsp" />
<t:default>
    <h2><c:out value="${user.fullName}" /></h2>
    <h3>Ses livres</h3>
    <c:choose>
        <c:when test="${fn:length(user.livres) gt 0}">
                <c:set var="livres" scope="request" value="${user.livres}"/>
                <jsp:include page="../macro/display-books.jsp" />
   </c:when>
    <c:otherwise>Pas de r&eacute;sultats</c:otherwise>
    </c:choose>

 <h3>Les livres de ses amis</h3>
    <c:choose>
    <c:when test="${fn:length(user.userFriends) gt 0}">

            <c:forEach items="${user.userFriends}" var="userFriend">
                    <h4><c:out value="${userFriend.fullName}"/></h4>
                        <c:set var="livres" scope="request" value="${userFriend.livres}"/>
                        <jsp:include page="../macro/display-books.jsp" />
            </c:forEach>
    </c:when>
    <c:otherwise>Pas de r&eacute;sultats</c:otherwise>
    </c:choose>
</t:default>