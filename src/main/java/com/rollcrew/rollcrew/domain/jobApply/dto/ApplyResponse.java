package com.rollcrew.rollcrew.domain.jobApply.dto;

import com.rollcrew.rollcrew.domain.jobApply.entity.Apply;
import com.rollcrew.rollcrew.domain.jobApply.entity.ApplyStatus;
import lombok.Builder;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
@Builder
public class ApplyResponse {

    private Long applyId;
    private Long jobPostId;
    private String applicantNickname;
    private String message;
    private ApplyStatus status;
    private LocalDateTime createdAt;

    public static ApplyResponse from(Apply apply) {
        return ApplyResponse.builder()
                .applyId(apply.getId())
                .jobPostId(apply.getJobPost().getId())
                .applicantNickname(apply.getApplicant().getNickname())
                .message(apply.getMessage())
                .status(apply.getStatus())
                .createdAt(apply.getCreatedAt())
                .build();
    }
}