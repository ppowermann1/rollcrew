package com.rollcrew.rollcrew.domain.community.repository;

import com.rollcrew.rollcrew.domain.community.entity.CommunityPostNickname;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommunityPostNicknameRepository extends JpaRepository<CommunityPostNickname, Long> {
}
