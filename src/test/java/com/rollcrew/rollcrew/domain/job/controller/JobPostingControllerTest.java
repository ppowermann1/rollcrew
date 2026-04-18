package com.rollcrew.rollcrew.domain.job.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rollcrew.rollcrew.domain.job.dto.JobPostingRequest;
import com.rollcrew.rollcrew.domain.job.dto.JobPostingResponse;
import com.rollcrew.rollcrew.domain.job.dto.JobPostingUpdateRequest;
import com.rollcrew.rollcrew.domain.job.entity.JobCategory;
import com.rollcrew.rollcrew.domain.job.entity.PostStatus;
import com.rollcrew.rollcrew.domain.job.service.JobPostingService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.doNothing;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(JobPostingController.class)
@Import(JobPostingControllerTest.TestSecurityConfig.class)
class JobPostingControllerTest {

    @TestConfiguration
    @EnableWebSecurity
    static class TestSecurityConfig {
        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
            http.csrf(csrf -> csrf.disable())
                    .authorizeHttpRequests(auth -> auth.anyRequest().permitAll());
            return http.build();
        }
    }

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private JobPostingService jobPostingService;

    private Authentication auth;
    private JobPostingResponse mockResponse;

    @BeforeEach
    void setUp() {
        auth = new UsernamePasswordAuthenticationToken(1L, null, Collections.emptyList());

        mockResponse = JobPostingResponse.builder()
                .id(1L)
                .userId(1L)
                .title("촬영 스태프 구합니다")
                .content("단편 영화 촬영 스태프 모집")
                .category(JobCategory.FILMING)
                .status(PostStatus.OPEN)
                .shootingDates("2026-05-01")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    @Test
    @DisplayName("구인 공고 생성 - 200")
    void createJobPosting() throws Exception {
        JobPostingRequest request = JobPostingRequest.builder()
                .title("촬영 스태프 구합니다")
                .content("단편 영화 촬영 스태프 모집")
                .category(JobCategory.FILMING)
                .shootingDates("2026-05-01")
                .build();

        given(jobPostingService.createJobPosting(eq(1L), any(JobPostingRequest.class))).willReturn(1L);

        mockMvc.perform(post("/api/job-postings")
                        .with(authentication(auth))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").value(1));
    }

    @Test
    @DisplayName("구인 공고 목록 조회 - 200")
    void getJobPostings() throws Exception {
        given(jobPostingService.getJobPostings()).willReturn(List.of(mockResponse));

        mockMvc.perform(get("/api/job-postings")
                        .with(authentication(auth)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].id").value(1))
                .andExpect(jsonPath("$.data[0].title").value("촬영 스태프 구합니다"));
    }

    @Test
    @DisplayName("구인 공고 단건 조회 - 200")
    void getJobPosting() throws Exception {
        given(jobPostingService.getJobPosting(1L)).willReturn(mockResponse);

        mockMvc.perform(get("/api/job-postings/1")
                        .with(authentication(auth)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(1))
                .andExpect(jsonPath("$.data.title").value("촬영 스태프 구합니다"));
    }

    @Test
    @DisplayName("구인 공고 수정 - 200")
    void updateJobPosting() throws Exception {
        JobPostingUpdateRequest request = new JobPostingUpdateRequest();

        given(jobPostingService.updateJobPosting(eq(1L), eq(1L), any(JobPostingUpdateRequest.class)))
                .willReturn(mockResponse);

        mockMvc.perform(patch("/api/job-postings/1")
                        .with(authentication(auth))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(1));
    }

    @Test
    @DisplayName("구인 공고 삭제 - 200")
    void deleteJobPosting() throws Exception {
        doNothing().when(jobPostingService).deleteJobPosting(1L, 1L);

        mockMvc.perform(delete("/api/job-postings/1")
                        .with(authentication(auth)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }
}
