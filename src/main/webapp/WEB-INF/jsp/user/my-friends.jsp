<%@ include file="/WEB-INF/jsp/include.jsp" %>
<t:default>
    <h2>Mes amis</h2>
    <div class="row">
     <div class="col-md-2"></div>
      <div class="col-md-8">
        <c:choose>
        <c:when test="${fn:length(user.userFriends) gt 0}">
            <c:forEach items="${user.userFriends}" var="ami">
                <b><c:out value="${ami.fullName}" /></b> : <a href="users/${ami.id}">Voir ses livres et ceux de ses amis</a> <br/>
            </c:forEach>
        </c:when>
        <c:otherwise>Vous n'avez pas d'amis actifs.</c:otherwise>
        </c:choose>

        <!-- AMIS EN ATTENTE DE CONFIRMATION -->
        <c:choose>
        <c:when test="${fn:length(pendingFriends) gt 0}">
            <h3>Mes amis inactifs (attente de leur confirmation)</h3>
            <c:forEach items="${pendingFriends}" var="emailUser">
                <c:out value="${emailUser.email}" /><br />
            </c:forEach>
        </c:when>
        </c:choose>
        <div class="text-center">
            <a href="<c:url value="/ami/new"/>"><button type="submit" class="btn btn-primary" >Ajouter un ami</button></a>
        </div>
         <div class="col-md-2"></div>
    </div>


</t:default>