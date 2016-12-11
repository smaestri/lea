<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags"%>
<c:set var="req" value="${pageContext.request}" />
<c:set var="url">${req.requestURL}</c:set>
<c:set var="uri" value="${req.requestURI}" />
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="">
    <base href="${fn:substring(url, 0, fn:length(url) - fn:length(uri))}${req.contextPath}/">
    <title>livres entre amis</title>
    <link rel="stylesheet" href="resources/css/bootstrap.css">
    <link rel="stylesheet" href="resources/css/bootstrap-theme.min.css">
    <link rel="stylesheet" href="resources/css/default.css">
    <link href="resources/css/star-rating.css" media="all" rel="stylesheet" type="text/css" />
    <script src="resources/js/jquery.min.js"></script>
    <script src="resources/js/bootstrap.min.js"></script>
    <script src="resources/js/livres.js"></script>
    <script src="resources/js/avis.js"></script>
    <script src="resources/js/account.js"></script>
    <script src="resources/js/star-rating.js" type="text/javascript"></script>
	<sec:csrfMetaTags/>
  </head>
  <body>
    <div class="container">
        <div id="header" class="row">
            <div class="col-md-2">
                <a href=""><img src="resources/img/logo.jpg" /></a>
            </div>
            <div class="col-md-4 title"> Livres entre amis</div>

            <div class="col-md-6 text-center">
                <sec:authorize access="hasRole('USER')">
                    <input id="userId" type="hidden" value="${userConnected.id}" />
                    <input id="hasFriend" type="hidden" value="${hasFriend}" />
                    <ul class="nav nav-pills">
                        <li class="listeHeader">Bonjour, ${userConnected.fullName}</li>
                        <li><a href="account">Mon compte</a></li>
                        <c:if test="${not empty requestedFriends}">
                            <li><img class="headerExcl" src="/resources/img/excl2.jpg">
                            <a href="myRequestedFriends">Demande d'amis!</a></li>
                        </c:if>
                        <li><a href="logout">Me d&eacute;connecter</a></li>
                    </ul>
                </sec:authorize>
            </div>
        </div>

        <sec:authorize access="hasRole('USER')">
        <div id ="barreRecherche" class="row text-center">
            <form:form id="formSearchBook" action="searchBook" class="form-inline" method="GET">
                <div class="form-group">
                    <form:input class="form-control" id="titreBarre" path="titreBook" placeholder="Titre du livre"/>
                </div>
                <div class="form-group">
                    <select name="categorie" class="form-control">
                        <option value="">-- Sélectionner --</option>
                        <c:forEach items="${categories}" var="cat">
                            <c:if test="${cat.id eq command.categorie.id}" >
                                 <option value="${cat.id}" selected>${cat.libelleCat}</option>
                            </c:if>
                            <c:if test="${cat.id ne command.categorie.id}" >
                                <option value="${cat.id}">${cat.libelleCat}</option>
                            </c:if>
                        </c:forEach>
                    </select>
                </div>
                <input type="submit" value="Rechercher" class="btn btn-default" />
          	</form:form>
        </div>
        <div id="menu" class="row">
            <ul id="menuAccount" class="nav nav-pills">
                <li><a href="myBooks" >Mes Livres</a></li>
                <li><a href="myFriends" >Mes amis</a></li>
                <li><a href="emprunts" >Mes emprunts <c:if test ="${nbEmprunts > 0}"><b>(${nbEmprunts})</b></c:if></a></li>
                <li><a href="prets" >Mes pr&ecirc;ts <c:if test ="${nbPrets > 0}"><b>(${nbPrets})</b></c:if></a></li>
            </ul>
        </div>
        </sec:authorize>
        <div id="main-content">
            <jsp:doBody/>
        </div>

    </div>
     <div id="footer" class="row">
        <ul class="nav nav-pills">
            <li><a href="mentions">Mentions l&eacute;gales</a></li>
            <li><a href="comment">Comment ça marche?</a></li>
        </ul>
    </div>
  </body>
</html>
