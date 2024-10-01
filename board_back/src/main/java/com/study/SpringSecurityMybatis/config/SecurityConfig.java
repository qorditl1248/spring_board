package com.study.SpringSecurityMybatis.config;

import com.study.SpringSecurityMybatis.security.filter.JwtAccessTokenFilter;
import com.study.SpringSecurityMybatis.security.handler.AuthenticationHandler;
import com.study.SpringSecurityMybatis.security.handler.OAuth2SuccessHandler;
import com.study.SpringSecurityMybatis.service.OAuth2Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@EnableWebSecurity // spring security를 활성화
@Configuration
// extends web~ 스프링 시큐리티의 설정을 쉽게 도와주는 클래스, 보안 관련 설정을 커스터마이징 할 수 있음
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired private JwtAccessTokenFilter jwtAccessTokenFilter;

    @Autowired private AuthenticationHandler authenticationHandler;

    @Autowired private OAuth2SuccessHandler oAuth2SuccessHandler;

    @Autowired private OAuth2Service oAuth2Service;



    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.formLogin().disable();
        http.httpBasic().disable();
        http.csrf().disable();
        http.headers().frameOptions().disable(); // h2 콘솔 사용하기 위해서
        // 시큐리티 - 세션저장소를 사용하지 않겠다
        http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
        http.cors(); // webmvcConfig가 존재한다면, webmvcConfig에 들어있는 addCorsMapping 셋팅을 따라감

        // oauth2 로그인을 사용하겠다
        http.oauth2Login()
                .successHandler(oAuth2SuccessHandler) // 로그인 성공 후에 oAuth2SuccessHandler 실행
                .userInfoEndpoint()
                .userService(oAuth2Service); // 사용자 정보를 가져오기 위해 service를 사용

        // authentication에서 오류가 나면 해당 handler로 오류가 던져지게
        http.exceptionHandling().authenticationEntryPoint(authenticationHandler);


        http.authorizeRequests()
                .antMatchers("/auth/**", "/h2-console/**") // 여기로 들어온느 요청은 인증없이 접근 허용
                .permitAll()
                .antMatchers(
                        HttpMethod.GET,
                        "/board/**"
                )
                .permitAll()
                .anyRequest()
                .authenticated();

        // jwtAccessTokenFilter를 usernam~ 이전에 실행되도록 설정
        http.addFilterBefore(jwtAccessTokenFilter, UsernamePasswordAuthenticationFilter.class);
    }
}
