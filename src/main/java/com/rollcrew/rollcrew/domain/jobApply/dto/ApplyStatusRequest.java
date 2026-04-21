package com.rollcrew.rollcrew.domain.jobApply.dto;

import com.rollcrew.rollcrew.domain.jobApply.entity.ApplyStatus;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ApplyStatusRequest {
    private ApplyStatus status;
}
