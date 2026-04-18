package com.rollcrew.rollcrew.domain.community.repository;

import com.rollcrew.rollcrew.domain.community.entity.CommunityPost;
import com.rollcrew.rollcrew.domain.community.entity.CommunityPostLike;
import com.rollcrew.rollcrew.domain.community.entity.LikeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommunityPostLikeRepository extends JpaRepository<CommunityPostLike, Long> {
    long countByCommunityPostAndLikeType(CommunityPost communityPost, LikeType likeType);
}
