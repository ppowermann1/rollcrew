package com.rollcrew.rollcrew.domain.community.repository;

import com.rollcrew.rollcrew.domain.community.entity.CommunityComment;
import com.rollcrew.rollcrew.domain.community.entity.CommunityPost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CommunityCommentRepository extends JpaRepository<CommunityComment, Long> {
    List<CommunityComment> findByCommunityPostAndParentIsNull(CommunityPost communityPost);

    List<CommunityComment> findByParent(CommunityComment parent);

    Page<CommunityComment> findByCommunityPostAndParentIsNull(CommunityPost communityPost, Pageable pageable);

    List<CommunityComment> findByParentIn(List<CommunityComment> parents);
}
