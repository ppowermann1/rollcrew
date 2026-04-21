package com.rollcrew.rollcrew.domain.user.dto;

import com.rollcrew.rollcrew.domain.user.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Builder
@AllArgsConstructor
@Getter
public class UserResponse {


        private Long id;
        private String email;
        private String nickname;
        private Role role;



}
