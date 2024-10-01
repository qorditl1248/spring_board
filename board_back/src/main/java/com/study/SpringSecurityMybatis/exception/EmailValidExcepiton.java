package com.study.SpringSecurityMybatis.exception;


import lombok.Getter;

public class EmailValidExcepiton extends RuntimeException  {

    @Getter
    private String email;

    public EmailValidExcepiton(String email) {
        super("이메일 인증 후 이용바랍니다. 인증 메일을 다시 받으시려면 확인버튼을 클릭하세요");
        this.email = email;
    }
}
