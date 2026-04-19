package com.rollcrew.rollcrew.domain.community.repository;

import com.rollcrew.rollcrew.domain.community.entity.CommunityPost;
import com.rollcrew.rollcrew.domain.community.entity.CommunityPostLike;
import com.rollcrew.rollcrew.domain.community.entity.LikeType;
import com.rollcrew.rollcrew.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommunityPostLikeRepository extends JpaRepository<CommunityPostLike, Long> {
    long countByCommunityPostAndLikeType(CommunityPost communityPost, LikeType likeType);

    Optional<CommunityPostLike> findByUserAndCommunityPost(User user, CommunityPost communityPost);

    @Query("SELECT pl FROM CommunityPostLike pl WHERE pl.communityPost IN :posts")
    List<CommunityPostLike> findByCommunityPostIn(@Param("posts") List<CommunityPost> posts);


}
