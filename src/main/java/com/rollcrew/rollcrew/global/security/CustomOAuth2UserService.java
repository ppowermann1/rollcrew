package com.rollcrew.rollcrew.global.security;

import com.rollcrew.rollcrew.domain.user.entity.Profile;
import com.rollcrew.rollcrew.domain.user.entity.User;
import com.rollcrew.rollcrew.domain.user.repository.ProfileRepository;
import com.rollcrew.rollcrew.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;


    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        try {
            OAuth2User oAuth2User = super.loadUser(userRequest);

            String provider = userRequest.getClientRegistration().getRegistrationId();
            Map<String, Object> attributes = oAuth2User.getAttributes();
            log.info("[OAuth2] provider={}, attributes={}", provider, attributes);

            String providerId;
            String email;
            String nickname;
            String profileImageUrl = null;

            if (provider.equals("naver")) {
                Map<String, Object> response = (Map<String, Object>) attributes.get("response");
                log.info("[OAuth2] naver response={}", response);
                providerId = (String) response.get("id");
                email = (String) response.get("email");
                nickname = (String) response.get("nickname");
                profileImageUrl = (String) response.get("profile_image");

            } else { // kakao
                Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
                log.info("[OAuth2] kakao_account={}", kakaoAccount);
                Map<String, Object> profile = (Map<String, Object>) kakaoAccount.get("profile");
                log.info("[OAuth2] kakao profile={}", profile);
                providerId = String.valueOf(attributes.get("id"));
                nickname = (String) profile.get("nickname");
                profileImageUrl = (String) profile.get("profile_image_url");

                email = provider + "_" + providerId + "@rollcrew.com";
            }

            User user = userRepository.findByProviderAndProviderId(provider, providerId)
                    .orElseGet(() -> userRepository.save(
                            User.builder()
                                    .email(email)
                                    .nickname(nickname)
                                    .provider(provider)
                                    .providerId(providerId)
                                    .build()
                    ));
            String finalProfileImageUrl = profileImageUrl;
            profileRepository.findByUser(user).ifPresentOrElse(
                    p -> p.updateProfileImage(finalProfileImageUrl),
                    () -> profileRepository.save(
                            Profile.builder()
                                    .user(user)
                                    .profileImageUrl(finalProfileImageUrl)
                                    .build()
                    )
            );

            return new CustomOAuth2User(user, attributes);

        } catch (Exception e) {
            log.error("[OAuth2] loadUser 실패: {}", e.getMessage(), e);
            throw e;
        }
    }

}
