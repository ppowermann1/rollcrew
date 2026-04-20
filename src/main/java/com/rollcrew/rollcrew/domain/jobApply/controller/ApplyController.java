package com.rollcrew.rollcrew.domain.jobApply.controller;


import com.rollcrew.rollcrew.domain.jobApply.dto.ApplyRequest;
import com.rollcrew.rollcrew.domain.jobApply.dto.ApplyResponse;
import com.rollcrew.rollcrew.domain.jobApply.dto.ApplyStatusRequest;
import com.rollcrew.rollcrew.domain.jobApply.service.ApplyService;
import com.rollcrew.rollcrew.global.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ApplyController {

    private final ApplyService applyService;


    @PostMapping("/job-postings/{jobPostId}/applies")
    public ResponseEntity<ApiResponse<ApplyResponse>> createApply(@PathVariable Long jobPostId,
                                                                  @AuthenticationPrincipal Long userid,
                                                                  @RequestBody ApplyRequest request) {
        ApplyResponse response = applyService.createApply(jobPostId, userid, request);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/job-postings/{jobPostId}/applies")
    public ResponseEntity<ApiResponse<List<ApplyResponse>>> getApplies(@PathVariable Long jobPostId,
                                                                       @AuthenticationPrincipal Long userid) {
        List<ApplyResponse> responses = applyService.getApplies(jobPostId, userid);
        return ResponseEntity.ok(ApiResponse.ok(responses));
    }

    @PatchMapping("/applies/{applyId}/status")
    public ResponseEntity<ApiResponse<ApplyResponse>> updateApplyStatus(@PathVariable Long applyId,
                                                                        @AuthenticationPrincipal Long userid,
                                                                        @RequestBody ApplyStatusRequest request) {
        ApplyResponse response = applyService.updateApplyStatus(applyId, userid, request);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @DeleteMapping("/applies/{applyId}")
    public ResponseEntity<ApiResponse<Void>> cancelApply(@PathVariable Long applyId,
                                                         @AuthenticationPrincipal Long userid) {
        applyService.cancelApply(applyId,userid);

        return ResponseEntity.noContent().build();
    }


}
