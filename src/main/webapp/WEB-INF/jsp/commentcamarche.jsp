<%@ include file="/WEB-INF/jsp/include.jsp" %>

<t:default>
    <h1>Bienvenue sur Livres entre Amis!</h1>
    <div class="index">
        Ce site vous permet d'emprunter des livres entre amis, de fa&ccedil;on totalement gratuite!

        <table><tr>
        <td width="50px"><img src="<c:url value="/static/resources/img/2-askbook.jpg" />"></td>
        <td width="20px" rowspan="2" style="padding-left: 10px;padding-right: 10px">
        	<img src="<c:url value="/static/resources/img/fleche.jpg" />"></td>
        <td width="50px">
        	<img src="<c:url value="/static/resources/img/1-book_searching.jpg" />"></td>
        <td width="20px" rowspan="2" style="padding-left: 10px;padding-right: 10px">
        	<img src="<c:url value="/static/resources/img/fleche.jpg" />"></td>
        <td width="50px">
        	<img src="<c:url value="/static/resources/img/3-accept-book.jpg" />"></td>
        <td width="20px" rowspan="2" style="padding-left: 10px;padding-right: 10px">
        	<img src="<c:url value="/static/resources/img/fleche.jpg" />"></td>
        <td width="50px">
        	<img src="<c:url value="/static/resources/img/4-readbook.jpg"/>"></td>
        </tr>
        <tr>
        <td width="50px">1 - Je m'inscris sur le site</td>
        <td width="50px">2 - J'enregistre mes livres </td>
        <td width="50px">3 - Je d&eacuteclare mes amis en indiquant leur mail. Ils recevront un mail les invitant &agrave; accepter votre demande et rejoindre Livreentreamis.com!</td>
        <td width="50px">4 - Une fois la demande accept&eacutee, je peux &eacutechanger des livres avec cet ami, et les amis de celui-ci!</td>
        </tr>
        </table>
    </div>

</t:default>
