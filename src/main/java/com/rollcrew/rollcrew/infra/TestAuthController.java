package com.rollcrew.rollcrew.infra;

import com.rollcrew.rollcrew.domain.user.entity.User;
import com.rollcrew.rollcrew.domain.user.repository.UserRepository;
import com.rollcrew.rollcrew.global.config.JwtProvider;
import com.rollcrew.rollcrew.global.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/test")
@Profile("local")
@RequiredArgsConstructor
public class TestAuthController {

    private final UserRepository userRepository;
    private final JwtProvider jwtProvider;

    // 전체 유저 목록 조회 (닉네임 + id)
    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<TestUserDto>>> getUsers() {
        List<TestUserDto> users = userRepository.findAll().stream()
                .map(u -> new TestUserDto(u.getId(), u.getNickname()))
                .toList();
        return ResponseEntity.ok(ApiResponse.ok(users));
    }

    // 닉네임으로 JWT 발급
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<String>> login(@RequestParam String nickname) {
        User user = userRepository.findByNickname(nickname)
                .orElseThrow(() -> new RuntimeException("유저 없음: " + nickname));
        String token = jwtProvider.generateToken(user.getId(), user.getRole());
        return ResponseEntity.ok(ApiResponse.ok(token));
    }

    record TestUserDto(Long id, String nickname) {}
}
