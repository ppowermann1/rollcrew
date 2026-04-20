package com.rollcrew.rollcrew.domain.job.repository;

import com.rollcrew.rollcrew.domain.job.entity.JobPost;
import com.rollcrew.rollcrew.domain.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JobPostRepository extends JpaRepository<JobPost,Long> {

    Page<JobPost> findByUser(User user, Pageable pageable);
}
