package com.rollcrew.rollcrew.domain.community.repository;


import com.rollcrew.rollcrew.domain.community.entity.CommunityPost;
import com.rollcrew.rollcrew.domain.community.entity.CommunityPostImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommunityPostImageRepository extends JpaRepository<CommunityPostImage, Long> {
    List<CommunityPostImage> findByCommunityPost(CommunityPost communityPost);
}
