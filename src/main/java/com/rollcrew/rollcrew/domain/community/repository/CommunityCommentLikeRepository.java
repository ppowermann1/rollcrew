package com.rollcrew.rollcrew.domain.community.repository;

import com.rollcrew.rollcrew.domain.community.entity.CommunityComment;
import com.rollcrew.rollcrew.domain.community.entity.CommunityCommentLike;
import com.rollcrew.rollcrew.domain.community.entity.LikeType;
import com.rollcrew.rollcrew.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CommunityCommentLikeRepository extends JpaRepository<CommunityCommentLike, Long> {

    Optional<CommunityCommentLike> findByUserAndCommunityComment(User user, CommunityComment communityComment);

    @Query("SELECT cl FROM CommunityCommentLike cl WHERE cl.communityComment IN :comments")
    List<CommunityCommentLike> findByCommunityCommentIn(@Param("comments") List<CommunityComment> comments);
}
