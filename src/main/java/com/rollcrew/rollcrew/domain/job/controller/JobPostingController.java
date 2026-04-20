package com.rollcrew.rollcrew.domain.job.controller;

import com.rollcrew.rollcrew.domain.job.dto.JobPostingRequest;
import com.rollcrew.rollcrew.domain.job.dto.JobPostingResponse;
import com.rollcrew.rollcrew.domain.job.dto.JobPostingUpdateRequest;
import com.rollcrew.rollcrew.domain.job.service.JobPostingService;
import com.rollcrew.rollcrew.global.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/job-postings")
@RequiredArgsConstructor
public class JobPostingController {

    private final JobPostingService jobPostingService;

    @PostMapping
    public ResponseEntity<ApiResponse<Long>> createJobPosting(@AuthenticationPrincipal Long userId,
                                                              @RequestBody JobPostingRequest jobPostingRequest) {
        Long response = jobPostingService.createJobPosting(userId, jobPostingRequest);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<JobPostingResponse>>> getJobPostings() {
        List<JobPostingResponse> response = jobPostingService.getJobPostings();
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/{jobPostId}")
    public ResponseEntity<ApiResponse<JobPostingResponse>> getJobPosting(@PathVariable Long jobPostId) {
        JobPostingResponse response = jobPostingService.getJobPosting(jobPostId);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PatchMapping("/{jobPostId}")
    public ResponseEntity<ApiResponse<JobPostingResponse>> updateJobPosting(@AuthenticationPrincipal Long userId,
                                                                            @PathVariable Long jobPostId,
                                                                            @RequestBody JobPostingUpdateRequest request) {
        JobPostingResponse response = jobPostingService.updateJobPosting(userId, jobPostId, request);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @DeleteMapping("/{jobPostId}")
    public ResponseEntity<ApiResponse<Void>> deleteJobPosting(@AuthenticationPrincipal Long userId,
                                                              @PathVariable Long jobPostId) {
        jobPostingService.deleteJobPosting(userId, jobPostId);
        return ResponseEntity.ok(ApiResponse.ok(null));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<List<JobPostingResponse>>> getMyJobPostings(
            @AuthenticationPrincipal Long userId) {

        List<JobPostingResponse> responses = jobPostingService.getMyJobPostings(userId);
        return ResponseEntity.ok(ApiResponse.ok(responses));
    }
}
