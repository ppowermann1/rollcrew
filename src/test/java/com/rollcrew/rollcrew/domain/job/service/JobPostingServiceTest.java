package com.rollcrew.rollcrew.domain.job.service;

import com.rollcrew.rollcrew.domain.job.dto.JobPostingRequest;
import com.rollcrew.rollcrew.domain.job.dto.JobPostingResponse;
import com.rollcrew.rollcrew.domain.job.dto.JobPostingUpdateRequest;
import com.rollcrew.rollcrew.domain.job.entity.JobCategory;
import com.rollcrew.rollcrew.domain.job.entity.JobPost;
import com.rollcrew.rollcrew.domain.job.entity.PostStatus;
import com.rollcrew.rollcrew.domain.job.repository.JobPostRepository;
import com.rollcrew.rollcrew.domain.user.entity.User;
import com.rollcrew.rollcrew.domain.user.repository.UserRepository;
import com.rollcrew.rollcrew.global.exception.BusinessException;
import com.rollcrew.rollcrew.global.exception.ErrorCode;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class JobPostingServiceTest {

    @Mock
    private JobPostRepository jobPostRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private JobPostingService jobPostingService;

    private User mockUser;
    private JobPost mockJobPost;

    @BeforeEach
    void setUp() {
        mockUser = User.builder()
                .id(1L)
                .email("test@test.com")
                .nickname("tester")
                .build();

        mockJobPost = JobPost.builder()
                .id(1L)
                .user(mockUser)
                .title("촬영 스태프 구합니다")
                .content("단편 영화 촬영 스태프 모집")
                .category(JobCategory.FILMING)
                .shootingDates("2026-05-01")
                .build();
    }

    @Test
    @DisplayName("구인 공고 생성 성공")
    void createJobPosting_success() {
        JobPostingRequest request = JobPostingRequest.builder()
                .title("촬영 스태프 구합니다")
                .content("단편 영화 촬영 스태프 모집")
                .category(JobCategory.FILMING)
                .shootingDates("2026-05-01")
                .build();

        given(userRepository.findById(1L)).willReturn(Optional.of(mockUser));
        given(jobPostRepository.save(any(JobPost.class))).willReturn(mockJobPost);

        Long result = jobPostingService.createJobPosting(1L, request);

        verify(jobPostRepository).save(any(JobPost.class));
    }

    @Test
    @DisplayName("구인 공고 생성 실패 - 유저 없음")
    void createJobPosting_userNotFound() {
        JobPostingRequest request = JobPostingRequest.builder()
                .title("제목")
                .content("내용")
                .category(JobCategory.FILMING)
                .shootingDates("2026-05-01")
                .build();

        given(userRepository.findById(99L)).willReturn(Optional.empty());

        assertThatThrownBy(() -> jobPostingService.createJobPosting(99L, request))
                .isInstanceOf(BusinessException.class)
                .hasMessage(ErrorCode.USER_NOT_FOUND.getMessage());
    }

    @Test
    @DisplayName("구인 공고 단건 조회 성공")
    void getJobPosting_success() {
        given(jobPostRepository.findById(1L)).willReturn(Optional.of(mockJobPost));

        JobPostingResponse result = jobPostingService.getJobPosting(1L);

        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getTitle()).isEqualTo("촬영 스태프 구합니다");
    }

    @Test
    @DisplayName("구인 공고 단건 조회 실패 - 없는 공고")
    void getJobPosting_notFound() {
        given(jobPostRepository.findById(99L)).willReturn(Optional.empty());

        assertThatThrownBy(() -> jobPostingService.getJobPosting(99L))
                .isInstanceOf(BusinessException.class)
                .hasMessage(ErrorCode.JOB_POST_NOT_FOUND.getMessage());
    }

    @Test
    @DisplayName("구인 공고 목록 조회 성공")
    void getJobPostings_success() {
        given(jobPostRepository.findAll()).willReturn(List.of(mockJobPost));

        List<JobPostingResponse> result = jobPostingService.getJobPostings();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getTitle()).isEqualTo("촬영 스태프 구합니다");
    }

    @Test
    @DisplayName("구인 공고 수정 성공")
    void updateJobPosting_success() {
        JobPostingUpdateRequest request = new JobPostingUpdateRequest();

        given(jobPostRepository.findById(1L)).willReturn(Optional.of(mockJobPost));

        JobPostingResponse result = jobPostingService.updateJobPosting(1L, 1L, request);

        assertThat(result.getId()).isEqualTo(1L);
    }

    @Test
    @DisplayName("구인 공고 수정 실패 - 다른 유저")
    void updateJobPosting_forbidden() {
        JobPostingUpdateRequest request = new JobPostingUpdateRequest();

        given(jobPostRepository.findById(1L)).willReturn(Optional.of(mockJobPost));

        assertThatThrownBy(() -> jobPostingService.updateJobPosting(2L, 1L, request))
                .isInstanceOf(BusinessException.class)
                .hasMessage(ErrorCode.FORBIDDEN.getMessage());
    }

    @Test
    @DisplayName("구인 공고 삭제 성공")
    void deleteJobPosting_success() {
        given(jobPostRepository.findById(1L)).willReturn(Optional.of(mockJobPost));

        jobPostingService.deleteJobPosting(1L, 1L);

        verify(jobPostRepository).delete(mockJobPost);
    }

    @Test
    @DisplayName("구인 공고 삭제 실패 - 다른 유저")
    void deleteJobPosting_forbidden() {
        given(jobPostRepository.findById(1L)).willReturn(Optional.of(mockJobPost));

        assertThatThrownBy(() -> jobPostingService.deleteJobPosting(2L, 1L))
                .isInstanceOf(BusinessException.class)
                .hasMessage(ErrorCode.FORBIDDEN.getMessage());
    }
}
