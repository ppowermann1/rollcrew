package com.rollcrew.rollcrew.domain.user.service;

import com.rollcrew.rollcrew.domain.user.dto.ProfileResponse;
import com.rollcrew.rollcrew.domain.user.dto.ProfileUpdateRequest;
import com.rollcrew.rollcrew.domain.user.dto.UserResponse;
import com.rollcrew.rollcrew.domain.user.entity.Profile;
import com.rollcrew.rollcrew.domain.user.entity.User;
import com.rollcrew.rollcrew.domain.user.repository.ProfileRepository;
import com.rollcrew.rollcrew.domain.user.repository.UserRepository;
import com.rollcrew.rollcrew.global.exception.BusinessException;
import com.rollcrew.rollcrew.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {
    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;

    @Transactional(readOnly = true)
    public UserResponse getMyInfo(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .nickname(user.getNickname())
                .role(user.getRole())
                .build();
    }

    @Transactional(readOnly = true)
    public ProfileResponse getProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new
                        BusinessException(ErrorCode.USER_NOT_FOUND));
        Profile profile = profileRepository.findByUser(user)
                .orElse(null);
        return ProfileResponse.from(user, profile);
    }


    public ProfileResponse updateProfile(Long userId, ProfileUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new
                        BusinessException(ErrorCode.USER_NOT_FOUND));
        Profile profile = profileRepository.findByUser(user)
                .orElse(null);

        if (profile != null) {
            profile.updateProfile(request.getBio());
        } else {
            profile = profileRepository.save(Profile.builder().user(user).bio(request.getBio()).build());
        }
        return ProfileResponse.from(user, profile);

    }
}
