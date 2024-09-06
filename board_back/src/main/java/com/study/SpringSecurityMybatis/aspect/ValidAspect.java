package com.study.SpringSecurityMybatis.aspect;

import com.study.SpringSecurityMybatis.dto.request.ReqOAuth2JoinDto;
import com.study.SpringSecurityMybatis.dto.request.ReqSignupDto;
import com.study.SpringSecurityMybatis.exception.ValidException;
import com.study.SpringSecurityMybatis.service.UserService;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;

@Component
@Aspect
public class ValidAspect {

    // insert가 일어나기전에는 유효성 검사를 대부분함
    // 아이디 중복체크, 비밀번호 확인

    @Autowired
    private UserService userService;


    @Pointcut("@annotation(com.study.SpringSecurityMybatis.aspect.annotation.ValidAop)")
    public void pointCut() {}

    @Around("pointCut()")
    public Object around(ProceedingJoinPoint proceedingJoinPoint) throws Throwable {
        Object[] args = proceedingJoinPoint.getArgs(); // 매개변수 값들을 들고옴
        BindingResult bindingResult = null; // 유효성 검사를 하기 위해서 필요함

        for(Object arg : args) {
            if (arg.getClass() == BeanPropertyBindingResult.class) {
                bindingResult = (BeanPropertyBindingResult) arg;
                break;
            }
        }

        switch (proceedingJoinPoint.getSignature().getName()) { // 메소드명
            case "signup":
                validSignupDto(args, bindingResult);
                break;
            case "oAuth2Signup" :
                validOAuth2SignupDto(args, bindingResult);
                break;
        }


        if(bindingResult.hasErrors()) {
            throw new ValidException("유효성검사 오류", bindingResult.getFieldErrors());
        }


        return proceedingJoinPoint.proceed();
    }

    // signup
    private void validSignupDto(Object[] args, BindingResult bindingResult) {
        // dto 꺼내서 확인
        for(Object arg : args) {
            if(arg.getClass() == ReqSignupDto.class) {
                ReqSignupDto dto = (ReqSignupDto) arg;

                if(!dto.getPassword().equals(dto.getCheckPassword())) {
                    FieldError fieldError
                            = new FieldError("checkPassword","checkPassword", "비밀번호가 일치하지 않습니다");
                    bindingResult.addError(fieldError);
                }

                if(userService.isDuplicateUsername(dto.getUsername())) {
                    FieldError fieldError
                            = new FieldError("username", "username", "이미 존재하는 이름입니다");
                    bindingResult.addError(fieldError);
                }

            }
        }
    }

    // oauth signup
    private void validOAuth2SignupDto(Object[] args, BindingResult bindingResult) {
        // dto 꺼내서 확인
        for(Object arg : args) {
            if(arg.getClass() == ReqOAuth2JoinDto.class) {
                ReqOAuth2JoinDto dto = (ReqOAuth2JoinDto) arg;

                if(!dto.getPassword().equals(dto.getCheckPassword())) {
                    FieldError fieldError
                            = new FieldError("checkPassword","checkPassword", "비밀번호가 일치하지 않습니다");
                    bindingResult.addError(fieldError);
                }

                if(userService.isDuplicateUsername(dto.getUsername())) {
                    FieldError fieldError
                            = new FieldError("username", "username", "이미 존재하는 이름입니다");
                    bindingResult.addError(fieldError);
                }

            }
        }
    }


}
