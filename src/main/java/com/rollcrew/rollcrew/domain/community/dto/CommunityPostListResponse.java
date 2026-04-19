package com.rollcrew.rollcrew.domain.community.dto;


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

    private String title;
    private String nickname;
    private LocalDateTime createdAt;
    private Long likeCount;
    private Long dislikeCount;

}
