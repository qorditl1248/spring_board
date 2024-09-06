package com.study.SpringSecurityMybatis.controller;

import com.study.SpringSecurityMybatis.aspect.annotation.ValidAop;
import com.study.SpringSecurityMybatis.dto.request.*;
import com.study.SpringSecurityMybatis.entity.OAuth2User;
import com.study.SpringSecurityMybatis.exception.SignupException;
import com.study.SpringSecurityMybatis.service.OAuth2Service;
import com.study.SpringSecurityMybatis.service.TokenService;
import com.study.SpringSecurityMybatis.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

@RestController
public class AuthenticationController {

    @Autowired
    private UserService userService;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private OAuth2Service oAuth2Service;

    // dto랑 bindingResult가 만들어지고 난 뒤에 signup() 메소드가 실행
    // valid랑 bindingresult가 같이 따라다녀야함
    @ValidAop
    @PostMapping("/auth/signup") // 회원가입의 핵심기능은 데이터베이스에 값을 저장하는 것, 비밀번호&유저이름 등은 부가기능
    public ResponseEntity<?> signup(@Valid @RequestBody ReqSignupDto dto, BindingResult bindingResult) throws SignupException {
        return ResponseEntity.ok().body(userService.insertUserAndRoles(dto));
    }

    @ValidAop
    @PostMapping("/auth/signin")
    public ResponseEntity<?> signin(@Valid @RequestBody ReqSigninDto dto, BindingResult bindingResult) {
        return ResponseEntity.ok().body(userService.getGeneratedAccessToken(dto));
    }

    // access 토큰이 유효한지 검사 (토큰을 들고옴)
    // 시큐리티 필터에 걸리지않음 -> 대신 토큰 서비스에서
    @GetMapping("/auth/access")
    public ResponseEntity<?> access(ReqAccessDto dto) {
        return ResponseEntity.ok().body(tokenService.isValidAccessToken(dto.getAccessToken()));
    }

    // 통합 회원
    @ValidAop
    @PostMapping("/auth/oauth2/merge")
    public ResponseEntity<?> oAuth2Merge(@Valid @RequestBody ReqOAuth2MergeDto dto, BindingResult bindingResult) {
        OAuth2User oAuth2User = userService.mergeSignin(dto);
        oAuth2Service.merge(oAuth2User);
        return ResponseEntity.ok().body(true); // 응답에 대한 데이터는 프론트에서 달라고하는 형태로 주면됨
    }

    @ValidAop
    @PostMapping("/auth/oauth2/signup") // 회원가입의 핵심기능은 데이터베이스에 값을 저장하는 것, 비밀번호&유저이름 등은 부가기능
    public ResponseEntity<?> oAuth2Signup(@Valid @RequestBody ReqOAuth2JoinDto dto, BindingResult bindingResult) throws SignupException {
        oAuth2Service.oAuth2Signup(dto);
        return ResponseEntity.ok().body(true);
    }






}
