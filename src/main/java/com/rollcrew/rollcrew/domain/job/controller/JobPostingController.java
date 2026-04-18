package com.rollcrew.rollcrew.domain.job.controller;

import com.rollcrew.rollcrew.domain.job.dto.JobPostingRequest;
import com.rollcrew.rollcrew.domain.job.service.JobPostingService;
import com.rollcrew.rollcrew.global.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/job-postings")
@RequiredArgsConstructor
public class JobPostingController {

    private final JobPostingService jobPostingService;

    @PostMapping
    public ResponseEntity<ApiResponse<Long>> createJobPosting(@AuthenticationPrincipal Long userid,
                                                              @RequestBody JobPostingRequest jobPostingRequest) {

        Long response = jobPostingService.createJobPosting(userid, jobPostingRequest);

        return ResponseEntity.ok(ApiResponse.ok(response));

    }
}
