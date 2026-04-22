package com.rollcrew.rollcrew.domain.user.repository;

import com.rollcrew.rollcrew.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User,Long> {

    Optional<User> findByProviderAndProviderId(String provider, String providerId);

    Optional<User> findByNickname(String nickname);


}
