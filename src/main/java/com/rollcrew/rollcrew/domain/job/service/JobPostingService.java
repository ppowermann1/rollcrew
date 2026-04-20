package com.rollcrew.rollcrew.domain.job.service;

import com.rollcrew.rollcrew.domain.job.dto.JobPostingRequest;
import com.rollcrew.rollcrew.domain.job.dto.JobPostingResponse;
import com.rollcrew.rollcrew.domain.job.dto.JobPostingUpdateRequest;
import com.rollcrew.rollcrew.domain.job.entity.JobPost;
import com.rollcrew.rollcrew.domain.job.repository.JobPostRepository;
import com.rollcrew.rollcrew.domain.user.entity.User;
import com.rollcrew.rollcrew.domain.user.repository.UserRepository;
import com.rollcrew.rollcrew.global.exception.BusinessException;
import com.rollcrew.rollcrew.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class JobPostingService {

    private final JobPostRepository jobPostRepository;
    private final UserRepository userRepository;

    public Long createJobPosting(Long userid, JobPostingRequest jobPostingRequest) {
        User user = userRepository.findById(userid).orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        JobPost jobPost = JobPost.builder()
                .title(jobPostingRequest.getTitle())
                .content(jobPostingRequest.getContent())
                .category(jobPostingRequest.getCategory())
                .shootingDates(jobPostingRequest.getShootingDates())
                .user(user)
                .build();

        jobPostRepository.save(jobPost);

        return jobPost.getId();
    }

    @Transactional(readOnly = true)
    public JobPostingResponse getJobPosting(Long jobPostId) {
        JobPost jobPost = jobPostRepository.findById(jobPostId)
                .orElseThrow(() -> new BusinessException(ErrorCode.JOB_POST_NOT_FOUND));
        return JobPostingResponse.from(jobPost);
    }

    public Page<JobPostingResponse> getJobPostings(Pageable pageable) {
        return jobPostRepository.findAll(pageable)
                .map(JobPostingResponse::from);
    }

    public JobPostingResponse updateJobPosting(Long userId, Long jobPostId, JobPostingUpdateRequest request) {
        JobPost jobPost = jobPostRepository.findById(jobPostId)
                .orElseThrow(() -> new BusinessException(ErrorCode.JOB_POST_NOT_FOUND));

        if (!jobPost.getUser().getId().equals(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }

        jobPost.update(request.getTitle(), request.getContent(), request.getCategory(),
                request.getShootingDates(), request.getStatus());

        return JobPostingResponse.from(jobPost);
    }

    public void deleteJobPosting(Long userId, Long jobPostId) {
        JobPost jobPost = jobPostRepository.findById(jobPostId)
                .orElseThrow(() -> new BusinessException(ErrorCode.JOB_POST_NOT_FOUND));

        if (!jobPost.getUser().getId().equals(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }

        jobPostRepository.delete(jobPost);
    }

    @Transactional(readOnly = true)
    public Page<JobPostingResponse> getMyJobPostings(Long userId, Pageable pageable) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        return jobPostRepository.findByUser(user, pageable)
                .map(JobPostingResponse::from);
    }
}
