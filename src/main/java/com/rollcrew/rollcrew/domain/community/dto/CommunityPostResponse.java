package com.rollcrew.rollcrew.domain.community.dto;

import com.rollcrew.rollcrew.domain.community.entity.CommunityCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommunityPostResponse {
    private Long id;

    private Long userId;

    private CommunityCategory communityCategory;

    private String title;

    private String nickname;

    private String content;

    private List<String> imageURL;

    private LocalDateTime createdAt;

    private Long likeCount;
    private Long dislikeCount;

}
