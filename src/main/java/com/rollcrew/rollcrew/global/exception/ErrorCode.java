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
    POST_NOT_FOUND(HttpStatus.NOT_FOUND, "게시글을 찾을 수 없습니다"),
    NICKNAME_NOT_FOUND(HttpStatus.NOT_FOUND, "닉네임을 찾을 수 없습니다"),
    COMMENT_NOT_FOUND(HttpStatus.NOT_FOUND, "댓글을 찾을 수 없습니다"),
    COMMENT_DEPTH_EXCEEDED(HttpStatus.BAD_REQUEST, "댓글의 깊이는 1을 초과할 수 없습니다");

    private final HttpStatus httpStatus;
    private final String message;
}
