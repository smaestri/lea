<%@ include file="/WEB-INF/jsp/include.jsp" %>
<t:default>
    <div class="row">
        <h2 class="title_bloc">Mes demandes d'amis</h2>
        Voici les personnes qui vous ont ajout&eacute;es en tant qu'ami. Si vous conaissez cette personne et souhaitez &eacute;changer des livre avec elle, cliquer sur "Accepter"!
    </div>
    <div class="row">
        <c:choose>
        <c:when test="${fn:length(requestedFriends) gt 0}">
            <c:forEach items="${requestedFriends}" var="requestedFriend">
                <b>${requestedFriend.fullName}</b> - <a class="addFriend" data-friend="${requestedFriend.id}" href="#">Accepter</a> <br/>
            </c:forEach>
            <form:form action="accepterAmi" id="formRequestedFriend" method="POST">
                <input type="hidden" id="friend_id" name="friend_id" value="">
            </form:form>
        </c:when>
        <c:otherwise>Vous n'avez pas de demande d'amis</c:otherwise>
        </c:choose>
    </div>

</t:default>