<%@ include file="/WEB-INF/jsp/include.jsp" %>
<t:default>
    <h2>Mes pr&ecirc;ts</h2>
    <c:choose>
        <c:when test="${fn:length(pretsCourants) gt 0}">
            <c:set var="displayBoutton" value="true" scope="request" />
            <c:set var="prets" value="${pretsCourants}" scope="request" />
            <jsp:include page="../macro/display-pret.jsp" />
        </c:when>
    <c:otherwise>Pas de pr&ecirc;ts en cours</c:otherwise>
    </c:choose>
</t:default>