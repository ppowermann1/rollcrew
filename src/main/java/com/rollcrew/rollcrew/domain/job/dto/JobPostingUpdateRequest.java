package com.rollcrew.rollcrew.domain.job.dto;

import com.rollcrew.rollcrew.domain.job.entity.JobCategory;
import com.rollcrew.rollcrew.domain.job.entity.PostStatus;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class JobPostingUpdateRequest {

    private String title;
    private String content;
    private JobCategory category;
    private String shootingDates;
    private PostStatus status;
}
