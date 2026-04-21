package com.rollcrew.rollcrew.domain.community.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentPageResponse {
    private List<CommentResponse> comments;
    private int totalPages;
    private int currentPage;
}
