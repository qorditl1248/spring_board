package com.study.SpringSecurityMybatis.service;

import com.study.SpringSecurityMybatis.dto.request.*;
import com.study.SpringSecurityMybatis.dto.response.RespDeleteUserDto;
import com.study.SpringSecurityMybatis.dto.response.RespSigninDto;
import com.study.SpringSecurityMybatis.dto.response.RespSignupDto;
import com.study.SpringSecurityMybatis.dto.response.RespUserInfoDto;
import com.study.SpringSecurityMybatis.entity.OAuth2User;
import com.study.SpringSecurityMybatis.entity.Role;
import com.study.SpringSecurityMybatis.entity.User;
import com.study.SpringSecurityMybatis.entity.UserRoles;
import com.study.SpringSecurityMybatis.exception.EmailValidExcepiton;
import com.study.SpringSecurityMybatis.exception.SignupException;
import com.study.SpringSecurityMybatis.repository.RoleMapper;
import com.study.SpringSecurityMybatis.repository.UserMapper;
import com.study.SpringSecurityMybatis.repository.UserRolesMapper;
import com.study.SpringSecurityMybatis.security.jwt.JwtProvider;
import com.study.SpringSecurityMybatis.security.principal.PrincipalUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.SQLException;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Value("${user.profile.img.default}")
    private String defaultProfileImg;

    @Autowired private UserMapper userMapper;

    @Autowired private RoleMapper roleMapper;

    @Autowired private UserRolesMapper userRolesMapper;

    @Autowired private BCryptPasswordEncoder passwordEncoder;

    @Autowired private JwtProvider jwtProvider;

    // optional.ofNullable - Optional<User> 생성해주는 거랑 똑같음
    public Boolean isDuplicateUsername(String username) {
        return Optional.ofNullable(userMapper.findByUsername(username)).isPresent();
    }

    @Transactional(rollbackFor = SignupException.class) // 예외 터지면 rollback
    public RespSignupDto insertUserAndRoles(ReqSignupDto dto) throws SignupException {

        User user = null;

        try {
        user = dto.toEntity(passwordEncoder); // user 객체 안에 userId가 없음
        userMapper.save(user);                     // user를 db에 저장하고 나면 user안에 userId가 생김


       Role role = roleMapper.findByName("ROLE_USER"); // role_user라는 이름을 찾으러 가서 있으면 role객체에 담음
       if(role == null) { // 만약 role이 null 이라면
          role = Role.builder().name("ROLE_USER").build(); // role_user 이름을 만들어서 role객체에 담음
           roleMapper.save(role);
       }

       // userRoles
        UserRoles userRoles = UserRoles.builder()
                .userId(user.getId())
                .roleId(role.getId())
                .build();
        userRolesMapper.save(userRoles);

        user.setUserRoles(Set.of(userRoles));

        } catch (Exception e) {
            throw  new SignupException(e.getMessage());
        }

        return RespSignupDto.builder()
                .message("가입하신 이메일 주소를 통해 인증 후 사용할 수 있습니다.")
                .user(user)
                .build();
    }

    // 로그인
    public RespSigninDto getGeneratedAccessToken(ReqSigninDto dto) {
        // 요청온 dto의 username과 password를 검사하고 user 객체에 담음
        // 이 user를 가지고 토큰 생성
        User user = checkUsernameAndPassword(dto.getUsername(), dto.getPassword());

        if(user.getEmailValid() !=1 ) {
            throw new EmailValidExcepiton(user.getEmail());
        }

        return RespSigninDto.builder()
                .message("로그인 성공")
                .expireDate(jwtProvider.getExpireDate().toLocaleString())
                .accessToken(jwtProvider.generateAccessToken(user))
                .build();
    }

    // 로그인 할 떄 username이랑 password 맞는지 검사
    private User checkUsernameAndPassword(String username, String password) {
        User user = userMapper.findByUsername(username);
        if(user == null) { // username 없는거
            throw new UsernameNotFoundException("사용자 정보를 입력하세요");
        }
        // 데이터베이스의 암호화된 비밀번호와 로그인 시도한 비밀번호가 다르면 예외
        if(!passwordEncoder.matches(password, user.getPassword())) {
            throw new BadCredentialsException("사용자 정보를 입력하세요");
        }
        return user; // 예외가 발생하지 않으면 user 객체 리턴
    }

    // 아이디 삭제
    @Transactional(rollbackFor = SQLException.class)
    public RespDeleteUserDto deleteUser(Long id) {
        // 해당 user가 있는지 먼저 확인(id로 찾아)
        User user = null;
            // securityContextHodler 안에 getAuthentication해
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            PrincipalUser principalUser = (PrincipalUser) authentication.getPrincipal();
            // 토큰 안의 id랑 요청날릴때 보낸 id 비교
            if(principalUser.getId() != id) {
                throw new AuthenticationServiceException("삭제 할 수 있는 권한이 없습니다.");
            }
            user = userMapper.findById(id);
            if(user == null) {
                throw new AuthenticationServiceException("해당 사용자는 존재하지 않는 사용자입니다.");
            }
            userRolesMapper.deleteByUserId(id);
            userMapper.deleteById(id);

            return RespDeleteUserDto.builder()
                .isDeleting(true)
                .message("사용자 삭제 완료")
                .deletedUser(user)
                .build();
    }

    // user 정보 가지고 오기
    public RespUserInfoDto getUserInfo(Long id) {
        User user = userMapper.findById(id); // 유저 아이디에 맞는 user 정보 찾아옴
        Set<String> roles = user.getUserRoles().stream().map(
                userRoles -> userRoles.getRole().getName() // role객체 안에 이름을 가져옴
        ).collect(Collectors.toSet());  // 그걸 다시 set으로 바꿔줌

        return RespUserInfoDto.builder()
                .userId(user.getId())
                .username(user.getUsername())
                .name(user.getName())
                .email(user.getEmail())
                .img(user.getImg())
                .roles(roles)
                .build();
    }

    // user 프로필 업데이트
    public Boolean updateProfileImg(ReqProfileImgDto dto) {
        PrincipalUser principalUser = (PrincipalUser) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        // img가 없거나 비었으면 default이미지
        if( dto.getImg() == null || dto.getImg().isBlank()) {
            userMapper.modifyImgById(principalUser.getId(), defaultProfileImg);
            return true;
        }

        userMapper.modifyImgById(principalUser.getId(), dto.getImg());
        return  true;
    }

    // 통합회원
    public OAuth2User mergeSignin(ReqOAuth2MergeDto dto) {
        User user = checkUsernameAndPassword(dto.getUsername(), dto.getPassword());
        return OAuth2User.builder()
                .userId(user.getId())
                .oAuth2Name(dto.getOauth2Name())
                .provider(dto.getProvider())
                .build();
    }
}
