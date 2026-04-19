package com.rollcrew.rollcrew.domain.user.controller;

import com.rollcrew.rollcrew.domain.user.dto.UserResponse;
import com.rollcrew.rollcrew.domain.user.entity.Role;
import com.rollcrew.rollcrew.domain.user.service.UserService;
import com.rollcrew.rollcrew.global.exception.BusinessException;
import com.rollcrew.rollcrew.global.exception.ErrorCode;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;

import static org.mockito.BDDMockito.given;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(UserController.class)
@Import(UserControllerTest.TestSecurityConfig.class)
class UserControllerTest {

    @TestConfiguration
    @EnableWebSecurity
    static class TestSecurityConfig {
        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
            http.csrf(csrf -> csrf.disable())
                    .authorizeHttpRequests(auth -> auth.anyRequest().permitAll());
            return http.build();
        }
    }

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Test
    @DisplayName("내 정보 조회 성공 - 200")
    void getMyInfo_success() throws Exception {
        Authentication auth = new UsernamePasswordAuthenticationToken(1L, null, Collections.emptyList());

        UserResponse response = UserResponse.builder()
                .email("test@test.com")
                .nickname("테스트유저")
                .role(Role.USER)
                .build();

        given(userService.getMyInfo(1L)).willReturn(response);

        mockMvc.perform(get("/api/users/me").with(authentication(auth)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.email").value("test@test.com"))
                .andExpect(jsonPath("$.data.nickname").value("테스트유저"))
                .andExpect(jsonPath("$.data.role").value("USER"));
    }

    @Test
    @DisplayName("내 정보 조회 실패 - 존재하지 않는 유저 404")
    void getMyInfo_notFound() throws Exception {
        Authentication auth = new UsernamePasswordAuthenticationToken(99L, null, Collections.emptyList());

        given(userService.getMyInfo(99L))
                .willThrow(new BusinessException(ErrorCode.USER_NOT_FOUND));

        mockMvc.perform(get("/api/users/me").with(authentication(auth)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value(ErrorCode.USER_NOT_FOUND.getMessage()));
    }
}
