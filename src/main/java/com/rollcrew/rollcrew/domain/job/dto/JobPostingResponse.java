package com.rollcrew.rollcrew.domain.job.dto;

import com.rollcrew.rollcrew.domain.job.entity.JobCategory;
import com.rollcrew.rollcrew.domain.job.entity.JobPost;
import com.rollcrew.rollcrew.domain.job.entity.PostStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class JobPostingResponse {

    private Long id;
    private Long userId;
    private String authorName;
    private String title;
    private String content;
    private JobCategory category;
    private PostStatus status;
    private String shootingDates;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static JobPostingResponse from(JobPost jobPost) {
        return JobPostingResponse.builder()
                .id(jobPost.getId())
                .userId(jobPost.getUser().getId())
                .authorName(jobPost.getUser().getNickname())
                .title(jobPost.getTitle())
                .content(jobPost.getContent())
                .category(jobPost.getCategory())
                .status(jobPost.getStatus())
                .shootingDates(jobPost.getShootingDates())
                .createdAt(jobPost.getCreatedAt())
                .updatedAt(jobPost.getUpdatedAt())
                .build();
    }
}
