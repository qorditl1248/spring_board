package com.study.SpringSecurityMybatis.security.handler;

import com.study.SpringSecurityMybatis.entity.User;
import com.study.SpringSecurityMybatis.repository.UserMapper;
import com.study.SpringSecurityMybatis.security.jwt.JwtProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Map;

// OAuth2Service에서 로그인 성공했을때 -> 이쪽 핸들러로 들어옴
@Component
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Autowired private UserMapper userMapper;

    @Autowired private JwtProvider jwtProvider;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {

        // oAuth2Service에서 넣어준거 꺼내다 쓰는
        DefaultOAuth2User defaultOAuth2User = (DefaultOAuth2User) authentication.getPrincipal();
        Map<String, Object> attributes = defaultOAuth2User.getAttributes();
        String oAuth2Name = attributes.get("id").toString();
        String provider = attributes.get("provider").toString();

        User user = userMapper.findByOAuth2Name(oAuth2Name);

        if(user == null) {
            // 강제 페이지 이동
            response.sendRedirect("http://localhost:3000/user/join/oauth2?oAuth2Name=" + oAuth2Name + "&provider=" + provider);
            return;
        }

        String accessToken = jwtProvider.generateAccessToken(user);
        response.sendRedirect("http://localhost:3000/user/login/oauth2?accessToken=" + accessToken);
    }
}
