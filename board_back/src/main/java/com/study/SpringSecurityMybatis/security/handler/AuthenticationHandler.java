package com.study.SpringSecurityMybatis.security.handler;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
// 인증 객체에 대한 오류가 뜨면, 여기로 오류를 던짐
// controller를 기준으로 controller전에 filter에서 터지면 handler에서 처리
public class AuthenticationHandler implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException, ServletException {
        // 한글 인코딩
        response.setContentType("text/plain");
        response.setCharacterEncoding("UTF-8");

        response.setStatus(403);
        response.getWriter().println("인증이 토큰이 유효하지 않습니다.");

        authException.printStackTrace(); // 서버쪽에서 어디서 예외가 터졌는지 콘솔에 보여줌, 해도 되고 안해도 됨
    }
}
