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
    COMMENT_DEPTH_EXCEEDED(HttpStatus.BAD_REQUEST, "댓글의 깊이는 1을 초과할 수 없습니다"),
    UNAUTHORIZED_ACCESS(HttpStatus.UNAUTHORIZED, "인증되지 않은 접근입니다"),
    FORBIDDEN_COMMENT(HttpStatus.FORBIDDEN, "댓글에 대한 권한이 없습니다"),
    JOB_CLOSED(HttpStatus.BAD_REQUEST, "구인이 마감되었습니다"),
    APPLY_OWN_POST(HttpStatus.BAD_REQUEST, "본인 공고에는 지원할 수 없습니다."),
    APPLY_DUPLICATE(HttpStatus.BAD_REQUEST, "이미 지원한 공고입니다."),
    NOT_POST_OWNER(HttpStatus.FORBIDDEN, "게시글 작성자만 확인할 수 있습니다"),
    APPLY_NOT_FOUND(HttpStatus.NOT_FOUND, "지원 내역을 찾을 수 없습니다"),
    APPLY_NOT_OWNER(HttpStatus.FORBIDDEN, "본인 지원만 취소할 수 있습니다."),
    PROFILE_NOT_FOUND(HttpStatus.NOT_FOUND, "프로필을 찾을 수 없습니다"),
    NOTIFICATION_NOT_FOUND(HttpStatus.NOT_FOUND, "알림을 찾을 수 없습니다");

    private final HttpStatus httpStatus;
    private final String message;
}
