package com.rollcrew.rollcrew.domain.user.service;

import com.rollcrew.rollcrew.domain.user.dto.UserResponse;
import com.rollcrew.rollcrew.domain.user.entity.Role;
import com.rollcrew.rollcrew.domain.user.entity.User;
import com.rollcrew.rollcrew.domain.user.repository.UserRepository;
import com.rollcrew.rollcrew.global.exception.BusinessException;
import com.rollcrew.rollcrew.global.exception.ErrorCode;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.BDDMockito.given;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    private User mockUser;

    @BeforeEach
    void setUp() {
        mockUser = User.builder()
                .id(1L)
                .email("test@test.com")
                .nickname("테스트유저")
                .provider("kakao")
                .providerId("kakao-123")
                .role(Role.USER)
                .build();
    }

    @Test
    @DisplayName("내 정보 조회 성공")
    void getMyInfo_success() {
        given(userRepository.findById(1L)).willReturn(Optional.of(mockUser));

        UserResponse response = userService.getMyInfo(1L);

        assertThat(response.getEmail()).isEqualTo("test@test.com");
        assertThat(response.getNickname()).isEqualTo("테스트유저");
        assertThat(response.getRole()).isEqualTo(Role.USER);
    }

    @Test
    @DisplayName("내 정보 조회 실패 - 존재하지 않는 유저")
    void getMyInfo_userNotFound() {
        given(userRepository.findById(99L)).willReturn(Optional.empty());

        assertThatThrownBy(() -> userService.getMyInfo(99L))
                .isInstanceOf(BusinessException.class)
                .hasMessage(ErrorCode.USER_NOT_FOUND.getMessage());
    }

    @Test
    @DisplayName("ADMIN 역할 유저 정보 조회")
    void getMyInfo_adminRole() {
        User adminUser = User.builder()
                .id(2L)
                .email("admin@test.com")
                .nickname("관리자")
                .provider("naver")
                .providerId("naver-456")
                .role(Role.ADMIN)
                .build();

        given(userRepository.findById(2L)).willReturn(Optional.of(adminUser));

        UserResponse response = userService.getMyInfo(2L);

        assertThat(response.getRole()).isEqualTo(Role.ADMIN);
        assertThat(response.getNickname()).isEqualTo("관리자");
    }
}
