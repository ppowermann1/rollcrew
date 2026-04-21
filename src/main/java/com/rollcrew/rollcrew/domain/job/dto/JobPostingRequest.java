package com.rollcrew.rollcrew.domain.job.dto;

import com.rollcrew.rollcrew.domain.job.entity.JobCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class JobPostingRequest {

    private String title;
    private String content;
    private JobCategory category;
    private String shootingDates;

}
