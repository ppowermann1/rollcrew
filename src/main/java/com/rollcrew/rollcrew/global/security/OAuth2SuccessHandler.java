package com.rollcrew.rollcrew.global.security;

import com.rollcrew.rollcrew.domain.user.entity.Role;
import com.rollcrew.rollcrew.global.config.JwtProvider;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor

public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtProvider jwtProvider;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {


        // 1. CustomOAuth2User 꺼내기
        CustomOAuth2User customOAuth2User = (CustomOAuth2User) authentication.getPrincipal();

        // 2. userId, role 꺼내기
        Long userId = customOAuth2User.getUser().getId();
        Role role = customOAuth2User.getUser().getRole();

        // 3. JWT 발급
        String token = jwtProvider.generateToken(userId, role);

        // 4. 응답 헤더에 JWT 담기
        response.setHeader("Authorization", "Bearer " + token);
        response.setStatus(HttpServletResponse.SC_OK);
    }
}
