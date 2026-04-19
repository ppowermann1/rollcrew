package com.rollcrew.rollcrew.domain.user.repository;

import com.rollcrew.rollcrew.domain.user.entity.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProfileRepository extends JpaRepository<Profile,Long> {
}
