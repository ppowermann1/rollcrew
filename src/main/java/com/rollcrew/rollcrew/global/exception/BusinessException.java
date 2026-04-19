package com.rollcrew.rollcrew.global.exception;


import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
public class BusinessException extends RuntimeException {
    private ErrorCode errorCode;

    public BusinessException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }
}
