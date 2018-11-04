package lea.configuration.security;

import com.google.gson.Gson;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.security.web.savedrequest.HttpSessionRequestCache;
import org.springframework.security.web.savedrequest.RequestCache;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class MySavedRequestAwareAuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private RequestCache requestCache = new HttpSessionRequestCache();

    @Override
    public void onAuthenticationSuccess(final HttpServletRequest request, final HttpServletResponse response, final Authentication authentication) throws ServletException, IOException {

        CustomUserDetailsService.UserPrincipal userDetails = (CustomUserDetailsService.UserPrincipal) authentication.getPrincipal();
        Gson gson = new Gson();
        String json = gson.toJson(userDetails);
        response.getWriter().append(json);
        response.setStatus(200);

        //        final SavedRequest savedRequest = requestCache.getRequest(request, response);
//
//        if (savedRequest == null) {
//            clearAuthenticationAttributes(request);
//            return;
//        }
//        final String targetUrlParameter = getTargetUrlParameter();
//        if (isAlwaysUseDefaultTargetUrl() || (targetUrlParameter != null && StringUtils.hasText(request.getParameter(targetUrlParameter)))) {
//            requestCache.removeRequest(request, response);
//            clearAuthenticationAttributes(request);
//            return;
//        }
//
//        clearAuthenticationAttributes(request);
    }

    public void setRequestCache(final RequestCache requestCache) {
        this.requestCache = requestCache;
    }
}