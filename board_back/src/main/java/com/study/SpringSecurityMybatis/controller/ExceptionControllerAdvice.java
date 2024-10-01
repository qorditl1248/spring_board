package com.study.SpringSecurityMybatis.controller;

import com.study.SpringSecurityMybatis.exception.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import javax.security.sasl.AuthenticationException;
import java.util.Map;

// controller안에서 터지는 예외들 여기서 잡아채감

@RestControllerAdvice
public class ExceptionControllerAdvice {

    @ExceptionHandler(ValidException.class)
    public ResponseEntity<?> validException(ValidException a) {
        return ResponseEntity.badRequest().body(a.getFieldErrors());
    }

    @ExceptionHandler(SignupException.class)
    public ResponseEntity<?> signupException(SignupException e) {
        return ResponseEntity.internalServerError().body(e.getMessage());
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<?> authenticationException(AuthenticationException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }

    @ExceptionHandler(AccessTokenValidException.class)
    public ResponseEntity<?> accessTokenValidException(AccessTokenValidException e) {
        return ResponseEntity.status(403).body(false);
    }

    @ExceptionHandler(NotFoundBoardException.class)
    public ResponseEntity<?> notFoundBoardException(NotFoundBoardException e) {
        return ResponseEntity.status(404).body(e.getMessage()); // 페이지가 잘못된거
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<?> AccessDeniedException(AccessDeniedException e) {
        return ResponseEntity.status(403).body(e.getMessage()); // 접근 권한 없는거
    }

    @ExceptionHandler(EmailValidExcepiton.class)
    public ResponseEntity<?> emailValidException(EmailValidExcepiton e) {
        return ResponseEntity.status(403).body(Map.of(
                "message", e.getMessage(),
                "email", e.getEmail()
        )); // 접근 권한 없는거
    }



}
