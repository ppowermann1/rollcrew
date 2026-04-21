package com.rollcrew.rollcrew.domain.jobApply.repository;

import com.rollcrew.rollcrew.domain.job.entity.JobPost;
import com.rollcrew.rollcrew.domain.jobApply.entity.Apply;
import com.rollcrew.rollcrew.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ApplyRepository extends JpaRepository<Apply, Long> {

    boolean existsByJobPostAndApplicant(JobPost jobPost, User applicant);


    @Query("SELECT a FROM Apply a JOIN FETCH a.applicant WHERE a.jobPost = :jobPost")
    List<Apply> findByJobPostWithApplicant(@Param("jobPost") JobPost jobPost);

    @Query("SELECT a FROM Apply a JOIN FETCH a.jobPost jp JOIN FETCH jp.user WHERE a.id = :applyId")
    Optional<Apply> findByIdWithJobPostAndUser(@Param("applyId") Long applyId);

    @Query("SELECT a FROM Apply a JOIN FETCH a.applicant WHERE a.id = :applyId")
    Optional<Apply> findByIdWithApplicant(@Param("applyId") Long applyId);
}