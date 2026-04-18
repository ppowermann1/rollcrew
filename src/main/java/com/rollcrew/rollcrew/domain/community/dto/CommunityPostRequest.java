package com.rollcrew.rollcrew.domain.community.dto;


import com.rollcrew.rollcrew.domain.community.entity.CommunityCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class CommunityPostRequest {

    private String title;
    private String content;
    private CommunityCategory communityCategory;
    private String nickname;


}
