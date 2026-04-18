package com.rollcrew.rollcrew.domain.job.service;

import com.rollcrew.rollcrew.domain.job.dto.JobPostingRequest;
import com.rollcrew.rollcrew.domain.job.entity.JobPost;
import com.rollcrew.rollcrew.domain.job.repository.JobPostRepository;
import com.rollcrew.rollcrew.domain.user.entity.User;
import com.rollcrew.rollcrew.domain.user.repository.UserRepository;
import com.rollcrew.rollcrew.global.exception.BusinessException;
import com.rollcrew.rollcrew.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
}
