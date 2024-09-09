package com.study.SpringSecurityMybatis.security.filter;

import com.study.SpringSecurityMybatis.entity.User;
import com.study.SpringSecurityMybatis.repository.UserMapper;
import com.study.SpringSecurityMybatis.security.jwt.JwtProvider;
import com.study.SpringSecurityMybatis.security.principal.PrincipalUser;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;


// HTTP 요청을 가로채 JWT(Json Web Token) 토큰을 확인하고,
// 이를 통해 인증된 사용자를 SecurityContext에 설정, 이후의 요청이 인증된 사용자로 처리
@Component
public class JwtAccessTokenFilter extends GenericFilter {

    @Autowired private JwtProvider jwtProvider;

    @Autowired private UserMapper userMapper;

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        // servletRequest요청을 http 요청으로 다운캐스팅
        HttpServletRequest request = (HttpServletRequest) servletRequest;

        // bearer이 붙여진 토큰값 들어옴
        String bearerAccessToken = request.getHeader("Authorization");

        if(bearerAccessToken == null || bearerAccessToken.isBlank()) {
            // 필터 체인을 통해서 다음으로 넘김
            filterChain.doFilter(servletRequest, servletResponse);
            return;
        }

        // bearer까지 잘린 accessToekn
        String accessToken = jwtProvider.removeBearer(bearerAccessToken);

        // accessToken을 암호화했을때
        Claims claims = null;
        try {
            claims = jwtProvider.getClaims(accessToken);
            Long userId = ((Integer)claims.get("userId")).longValue(); // object -> integer -> long으로
            // 데이터베이스의 userId 존재하는지 확인
            User user = userMapper.findById(userId);

            // 토큰은 유효하지만, 안에 들어가있는 계정을 못찾는 거
            if(user == null) {
                throw new JwtException("해당 ID(" + userId + ")의 사용자 정보를 찾지 못했습니다.");
            }

            PrincipalUser principalUser = user.toPrincipal();
            Authentication authentication = new  UsernamePasswordAuthenticationToken(principalUser, null, principalUser.getAuthorities());

            // 여기까지 값이 들어갔으면 필터 통과 - 여기 안에 user 객체 있음
            SecurityContextHolder.getContext().setAuthentication(authentication);

        } catch (JwtException e) {
            e.printStackTrace();
            filterChain.doFilter(servletRequest, servletResponse);
            return;
        }


        filterChain.doFilter(servletRequest, servletResponse);
    }
}
