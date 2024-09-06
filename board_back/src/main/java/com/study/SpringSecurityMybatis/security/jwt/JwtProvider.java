package com.study.SpringSecurityMybatis.security.jwt;

import com.study.SpringSecurityMybatis.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtProvider {

    private final Key key;

    // key라는 객체를 만들어야 함, secret문자열(yml에 있는 거 들고옴)을 BASE64로 디코딩해서 key값 생성
    public JwtProvider(@Value("${jwt.secret}") String secret) {
        this.key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
    }

    // 토큰 만료일자
    public Date getExpireDate() {
        return new Date(new Date().getTime() + (1000l * 60 * 60 * 24 * 30));
    }

    // User 객체를 통해 token 생성
    public String generateAccessToken(User user) {

        return Jwts.builder()
                .claim("userId", user.getId())
                .expiration(getExpireDate()) // 만료일자
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // 토큰 앞에 bearer 자르기
    public String removeBearer(String bearerToken) throws RuntimeException {
        if(bearerToken == null) {
            throw new RuntimeException();
        }
        int bearerLength = "bearer ".length();
        return bearerToken.substring(bearerLength);
    }

    // jwtparser 객체 생성
    public Claims getClaims(String token) {
        JwtParser jwtParser = Jwts.parser() // parser를 만들건데, 안에 있는 키를 줘서 그 키를 가지고 변환
                .setSigningKey(key)
                .build();

        // 받아온 토큰을 변환하고, payload를 꺼내서 리턴
        return jwtParser.parseClaimsJws(token).getPayload();
    }

}
