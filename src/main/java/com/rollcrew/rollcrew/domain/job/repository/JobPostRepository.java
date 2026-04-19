package com.rollcrew.rollcrew.domain.job.repository;

import com.rollcrew.rollcrew.domain.job.entity.JobPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JobPostRepository extends JpaRepository<JobPost,Long> {
}
