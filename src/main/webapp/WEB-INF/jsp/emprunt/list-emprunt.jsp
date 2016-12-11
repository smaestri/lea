<%@ include file="/WEB-INF/jsp/include.jsp" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<t:default>
    <h2>Mes emprunts</h2>
    <c:choose>
        <c:when test="${fn:length(empruntsCourants) gt 0}">
            <c:set var="emprunts" value="${empruntsCourants}" scope="request"  />
            <c:set var="displayBoutton" value="true" scope="request"  />
            <jsp:include page="../macro/display-emprunt.jsp" />
        </c:when>
    <c:otherwise>Vous n'avez pas d'emprunts en cours</c:otherwise>
    </c:choose>
</t:default>