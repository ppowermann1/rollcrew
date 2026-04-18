package com.rollcrew.rollcrew.global.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "유저를 찾을 수 없습니다"),
    JOB_POST_NOT_FOUND(HttpStatus.NOT_FOUND, "구인 공고를 찾을 수 없습니다"),
    FORBIDDEN(HttpStatus.FORBIDDEN, "접근 권한이 없습니다"),
    NICKNAME_NOT_FOUND(HttpStatus.NOT_FOUND, "닉네임을 찾을 수 없습니다");

    private final HttpStatus httpStatus;
    private final String message;
}
