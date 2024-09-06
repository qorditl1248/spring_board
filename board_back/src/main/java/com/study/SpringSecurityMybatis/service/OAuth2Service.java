package com.study.SpringSecurityMybatis.service;

import com.study.SpringSecurityMybatis.dto.request.ReqOAuth2JoinDto;
import com.study.SpringSecurityMybatis.entity.Role;
import com.study.SpringSecurityMybatis.entity.User;
import com.study.SpringSecurityMybatis.entity.UserRoles;
import com.study.SpringSecurityMybatis.repository.OAuth2UserMapper;
import com.study.SpringSecurityMybatis.repository.RoleMapper;
import com.study.SpringSecurityMybatis.repository.UserMapper;
import com.study.SpringSecurityMybatis.repository.UserRolesMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;

// oauth2 로그인되면 여기가 실행되는 거
@Service
public class OAuth2Service implements OAuth2UserService {

    @Autowired private DefaultOAuth2UserService defaultOAuth2UserService;

    @Autowired private BCryptPasswordEncoder passwordEncoder;

    @Autowired private OAuth2UserMapper oAuth2UserMapper;

    @Autowired private UserMapper userMapper;

    @Autowired private UserRolesMapper userRolesMapper;

    @Autowired private RoleMapper roleMapper;



    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        // 매개변수 userRequest안에 accessToken을 가지고 있음
        // clientRegistration
        OAuth2User oAuth2User = defaultOAuth2UserService.loadUser(userRequest);

        Map<String, Object> attributes = oAuth2User.getAttributes();
        Map<String, Object> oAuth2Attributes = new HashMap<>();

        oAuth2Attributes.put("provider", userRequest.getClientRegistration().getClientName());

        // id만 꺼내서 사용
        switch (userRequest.getClientRegistration().getClientName()) {
            case "Google":
                oAuth2Attributes.put("id", attributes.get("sub").toString());
                break;
            case "Naver":
                attributes = (Map<String, Object>) attributes.get("response");
                oAuth2Attributes.put("id", attributes.get("id").toString());
                break;
            case "Kakao":
                oAuth2Attributes.put("id", attributes.get("id").toString());
                break;
        }

        // 지금 여기서는 id만 리턴해주면 됨
        return new DefaultOAuth2User(new HashSet<>(), oAuth2Attributes, "id");
    }

    public void merge(com.study.SpringSecurityMybatis.entity.OAuth2User oAuth2User) {
        oAuth2UserMapper.save(oAuth2User);
    }

    @Transactional(rollbackFor = Exception.class)
    public void oAuth2Signup(ReqOAuth2JoinDto dto) {
        // 프론트에서 받아온 user 정보 저장()
        User user = dto.toEntity(passwordEncoder);
        userMapper.save(user); // userid가 존재함

        // role_user 찾아오기
        Role role = roleMapper.findByName("ROLE_USER");
        if(role == null) {
            role = Role.builder().name("ROLE_USER").build();
            roleMapper.save(role);
        }

        // userid랑 roleid 필요하니깐 위에 둘다 해놓고
        userRolesMapper.save(UserRoles.builder()
                .userId(user.getId())
                .roleId(role.getId())
                .build());

        oAuth2UserMapper.save(com.study.SpringSecurityMybatis.entity.OAuth2User
                .builder()
                .userId(user.getId())
                .oAuth2Name(dto.getOauth2Name())
                .provider(dto.getProvider())
                .build());

    }

}
