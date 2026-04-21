package com.rollcrew.rollcrew.domain.community.dto;


import com.rollcrew.rollcrew.domain.community.entity.CommunityCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommunityPostListResponse {

    private Long id;
    private CommunityCategory communityCategory;
    private String title;
    private String nickname;
    private LocalDateTime createdAt;
    private Long likeCount;
    private Long dislikeCount;

}
