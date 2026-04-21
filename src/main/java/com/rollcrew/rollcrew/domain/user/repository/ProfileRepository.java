package com.rollcrew.rollcrew.domain.user.repository;

import com.rollcrew.rollcrew.domain.user.entity.Profile;
import com.rollcrew.rollcrew.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, Long> {

    Optional<Profile> findByUser(User user);

}
