<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@taglib prefix="sec" uri="http://www.springframework.org/security/tags"%>

<form action="login" method="post" class="form-horizontal">
    <c:if test="${param.error != null}">
        <div class="alert alert-danger">
            <p>Utilisateur ou mot de passe incorrect</p>
        </div>
    </c:if>
    <c:if test="${param.logout != null}">
        <div class="alert alert-success">
            <p>Vous avez &eacute;t&eacute; d&eacute;connect&eacute; du site.</p>
        </div>
    </c:if>
    <div class="form-group">
        <label class="control-label" for="username">Email</label>
        <input type="text" class="form-control" id="username" name="username" placeholder="Votre e-mail" required>
    </div>
    <div class="form-group">
        <label class="control-label" for="password">Mot de passe</label>
        <input type="password" class="form-control" id="password" name="password" placeholder="Votre mot de passe" required>
    </div>
    <input type="hidden" name="${_csrf.parameterName}"  value="${_csrf.token}" />
    <div class="form-group">
        <input type="submit" class="btn btn-block btn-primary btn-default" value="Log in">
    </div>
    <span style="font-size: 16px;"><a href="<c:url value="/users/new" /> "> S'inscrire </a></span>
</form>
