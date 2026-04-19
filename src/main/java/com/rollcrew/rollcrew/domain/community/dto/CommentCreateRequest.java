package com.rollcrew.rollcrew.domain.community.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentCreateRequest {

    private String nickname;
    private String content;
    private Long parentId;
}

