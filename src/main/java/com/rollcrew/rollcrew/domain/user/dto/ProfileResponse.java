package com.rollcrew.rollcrew.domain.user.dto;


import com.rollcrew.rollcrew.domain.user.entity.Profile;
import com.rollcrew.rollcrew.domain.user.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class ProfileResponse {
    private String nickname;
    private String profileImageUrl;
    private String bio;
    private String portfolioUrl;

    public static ProfileResponse from(User user, Profile profile) {
        return ProfileResponse.builder()
                .nickname(user.getNickname())
                .profileImageUrl(profile != null ?
                        profile.getProfileImageUrl() : null)
                .bio(profile != null ? profile.getBio() : null)
                .portfolioUrl(profile != null ? profile.getPortfolioUrl() :
                        null)
                .build();
    }
}