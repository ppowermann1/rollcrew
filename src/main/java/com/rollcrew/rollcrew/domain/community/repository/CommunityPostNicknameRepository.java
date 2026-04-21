package com.rollcrew.rollcrew.domain.community.repository;

import com.rollcrew.rollcrew.domain.community.entity.CommunityPost;
import com.rollcrew.rollcrew.domain.community.entity.CommunityPostNickname;
import com.rollcrew.rollcrew.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommunityPostNicknameRepository extends JpaRepository<CommunityPostNickname, Long> {

    Optional<CommunityPostNickname> findByUserAndCommunityPost(User user, CommunityPost communityPost);

    List<CommunityPostNickname> findByCommunityPost(CommunityPost communityPost);

    List<CommunityPostNickname> findByCommunityPostIn(List<CommunityPost> posts);


}
