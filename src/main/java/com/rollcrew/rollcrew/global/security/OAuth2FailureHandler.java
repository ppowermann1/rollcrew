package com.rollcrew.rollcrew.global.security;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Slf4j
@Component
public class OAuth2FailureHandler extends SimpleUrlAuthenticationFailureHandler {

    public OAuth2FailureHandler() {
        super("http://localhost:3000/login?error=oauth");
    }

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
                                        AuthenticationException exception) throws IOException, ServletException {
        log.error("[OAuth2] 로그인 실패 - 원인: {}", exception.getMessage());
        log.error("[OAuth2] 예외 타입: {}", exception.getClass().getName());
        if (exception.getCause() != null) {
            log.error("[OAuth2] 원인 예외: {}", exception.getCause().getMessage());
        }
        super.onAuthenticationFailure(request, response, exception);
    }
}
