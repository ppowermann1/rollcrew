package com.rollcrew.rollcrew.global.config;

import com.rollcrew.rollcrew.domain.user.entity.Role;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.assertj.core.api.Assertions.assertThat;

class JwtProviderTest {

    private JwtProvider jwtProvider;

    @BeforeEach
    void setUp() {
        jwtProvider = new JwtProvider();
        ReflectionTestUtils.setField(jwtProvider, "secret", "rollcrew-secret-key-must-be-at-least-32-characters-long");
        ReflectionTestUtils.setField(jwtProvider, "expiration", 86400000L);
    }

    @Test
    @DisplayName("토큰 생성 성공")
    void generateToken_success() {
        String token = jwtProvider.generateToken(1L, Role.USER);
        assertThat(token).isNotNull().isNotBlank();
    }

    @Test
    @DisplayName("토큰 검증 성공")
    void validateToken_valid() {
        String token = jwtProvider.generateToken(1L, Role.USER);
        assertThat(jwtProvider.validateToken(token)).isTrue();
    }

    @Test
    @DisplayName("변조된 토큰 검증 실패")
    void validateToken_invalid() {
        assertThat(jwtProvider.validateToken("invalid.token.value")).isFalse();
    }

    @Test
    @DisplayName("빈 토큰 검증 실패")
    void validateToken_empty() {
        assertThat(jwtProvider.validateToken("")).isFalse();
    }

    @Test
    @DisplayName("토큰에서 userId 추출 성공")
    void getUserId_success() {
        String token = jwtProvider.generateToken(42L, Role.USER);
        Long userId = jwtProvider.getUserId(token);
        assertThat(userId).isEqualTo(42L);
    }

    @Test
    @DisplayName("ADMIN role 토큰 생성 및 userId 추출")
    void generateToken_adminRole() {
        String token = jwtProvider.generateToken(99L, Role.ADMIN);
        assertThat(jwtProvider.validateToken(token)).isTrue();
        assertThat(jwtProvider.getUserId(token)).isEqualTo(99L);
    }

    @Test
    @DisplayName("만료된 토큰 검증 실패")
    void validateToken_expired() {
        JwtProvider expiredProvider = new JwtProvider();
        ReflectionTestUtils.setField(expiredProvider, "secret", "rollcrew-secret-key-must-be-at-least-32-characters-long");
        ReflectionTestUtils.setField(expiredProvider, "expiration", -1000L);

        String token = expiredProvider.generateToken(1L, Role.USER);
        assertThat(expiredProvider.validateToken(token)).isFalse();
    }
}
