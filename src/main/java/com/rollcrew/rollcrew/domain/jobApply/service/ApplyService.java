package com.rollcrew.rollcrew.domain.jobApply.service;

import com.rollcrew.rollcrew.domain.job.entity.JobPost;
import com.rollcrew.rollcrew.domain.job.entity.PostStatus;
import com.rollcrew.rollcrew.domain.job.repository.JobPostRepository;
import com.rollcrew.rollcrew.domain.jobApply.dto.ApplyRequest;
import com.rollcrew.rollcrew.domain.jobApply.dto.ApplyResponse;
import com.rollcrew.rollcrew.domain.jobApply.dto.ApplyStatusRequest;
import com.rollcrew.rollcrew.domain.jobApply.entity.Apply;
import com.rollcrew.rollcrew.domain.jobApply.entity.ApplyStatus;
import com.rollcrew.rollcrew.domain.jobApply.repository.ApplyRepository;
import com.rollcrew.rollcrew.domain.notification.entity.NotificationType;
import com.rollcrew.rollcrew.domain.notification.service.NotificationService;
import com.rollcrew.rollcrew.domain.user.entity.User;
import com.rollcrew.rollcrew.domain.user.repository.UserRepository;
import com.rollcrew.rollcrew.global.exception.BusinessException;
import com.rollcrew.rollcrew.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class ApplyService {
    private final UserRepository userRepository;
    private final JobPostRepository jobPostRepository;
    private final ApplyRepository applyRepository;
    private final NotificationService notificationService;

    public ApplyResponse createApply(Long jobPostId, Long userid, ApplyRequest request) {

        User user = userRepository.findById(userid).orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        JobPost jobPost = jobPostRepository.findById(jobPostId).orElseThrow(() -> new BusinessException(ErrorCode.JOB_POST_NOT_FOUND));

        if (jobPost.getStatus() == PostStatus.CLOSED) {
            throw new BusinessException(ErrorCode.JOB_CLOSED);
        }

        if (jobPost.getUser().getId().equals(userid)) {
            throw new BusinessException(ErrorCode.APPLY_OWN_POST);
        }
        boolean isAlreadyApplied = applyRepository.existsByJobPostAndApplicant(jobPost, user);

        if (isAlreadyApplied) {
            throw new BusinessException(ErrorCode.APPLY_DUPLICATE);
        }

        Apply build = Apply.builder().
                jobPost(jobPost).
                applicant(user).
                message(request.getMessage())
                .build();
        Apply save = applyRepository.save(build);

        notificationService.createNotification(jobPost.getUser(),
                NotificationType.JOB_APPLY,
                user.getNickname() + "님이 지원했습니다",
                jobPost.getId());


        return ApplyResponse.from(save);


    }


    @Transactional(readOnly = true)
    public List<ApplyResponse> getApplies(Long jobPostId, Long userid) {

        JobPost jobPost = jobPostRepository.findById(jobPostId).orElseThrow(() -> new BusinessException(ErrorCode.JOB_POST_NOT_FOUND));

        if (!userid.equals(jobPost.getUser().getId())) {
            throw new BusinessException(ErrorCode.NOT_POST_OWNER);
        }

        return applyRepository.findByJobPostWithApplicant(jobPost).stream()
                .map(ApplyResponse::from)
                .toList();
    }


    public ApplyResponse updateApplyStatus(Long applyId, Long userid, ApplyStatusRequest request) {

        Apply apply = applyRepository.findByIdWithJobPostAndUser(applyId)
                .orElseThrow(() -> new BusinessException(ErrorCode.APPLY_NOT_FOUND));

        if (!userid.equals(apply.getJobPost().getUser().getId())) {
            throw new BusinessException(ErrorCode.NOT_POST_OWNER);
        }


        apply.updateStatus(request.getStatus());

        NotificationType notificationType = request.getStatus() == ApplyStatus.ACCEPTED
                ? NotificationType.JOB_ACCEPTED
                : NotificationType.JOB_REJECTED;

        notificationService.createNotification(
                apply.getApplicant(),
                notificationType,
                apply.getJobPost().getTitle() + " 지원이 " + (notificationType ==
                        NotificationType.JOB_ACCEPTED ? "수락" : "거절") + "됐습니다",
                apply.getJobPost().getId()
        );

        return ApplyResponse.from(apply);
    }

    public void cancelApply(Long applyId, Long userid) {

        Apply apply = applyRepository.findByIdWithApplicant(applyId)
                .orElseThrow(() -> new BusinessException(ErrorCode.APPLY_NOT_FOUND));

        if (!userid.equals(apply.getApplicant().getId())) {
            throw new BusinessException(ErrorCode.APPLY_NOT_OWNER);
        }

        applyRepository.delete(apply);

    }


    public ApplyResponse getMyApply(Long jobPostId, Long userId) {


        Apply apply = applyRepository.findByJobPost_IdAndApplicant_Id(jobPostId, userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.APPLY_NOT_FOUND));


        return ApplyResponse.from(apply);

    }
}
