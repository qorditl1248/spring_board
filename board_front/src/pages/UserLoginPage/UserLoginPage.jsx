
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { signinApi } from '../../apis/signinApi';
/** @jsxImportSource @emotion/react */
import * as s from './style';
import { instance } from '../../apis/util/instance';


// 로그인 페이지
function UserLoginPage(props) {

  const navigate = useNavigate();

  // 로그인 할때 입력받는 아이디랑 비밀번호 상태
  const [ inputUser, setInputUser ] = useState({
    username: "",
    password: ""
  });

  // 로그인 에러 메세지 상태 
  const [ fieldErrorMessages, setFieldErrorMessages ] = useState({
    username: <></>,
    password: <></>
  });

  // input에 입력하는 아이디랑 비밀번호의 상태를 set (input에 value 값 잡아줘야지 상태변경 )
  const handleInputUserOnchange = (e) => {
    setInputUser(inputUser => ({
      ...inputUser,
      [e.target.name] : e.target.value
    })); 
  }

  // 에러 메세지를 보여주는 거 
  const showFieldErrorMessage = (fieldErrors) => {  // fieldErrors를 받아와서

    let EmptyfieldErrors = { // 빈 에러 객체를 만들고
      username: <></>,
      password: <></>
    };

    // 가지고 온 fieldErrors를 반복돌려서 field이름이랑 default 메세지
    for(let fieldError of fieldErrors) { 
      EmptyfieldErrors = {    // 위 EmptyfieldErrors에 field이름 : default 메세지를 넣어줌
        ...EmptyfieldErrors,  // ~>  username:  "사용자 이름을 입력해주세요" (스프링부트에 reqsignin에)
        [fieldError.field] : <p>{fieldError.defaultMessage}</p>,
      }
    }

    setFieldErrorMessages(EmptyfieldErrors);
  }


  // 로그인하기 버튼 클릭 
  const handleLoginSubmitOnClick = async() => {
    
    // 로그인 요청 날림, 응답이 siginData에 담김  
    const signinData = await signinApi(inputUser);

    // isSuceess가 false 일 때 즉, 로그인 실패
    if(!signinData.isSuceess) {
      if(signinData.errorStatus === 'fieldError') { // 그 에러상태가 fieldError일때 
        showFieldErrorMessage(signinData.error);    // show~()함수에 에러 데이터를 담아서 호출
      }
      if(signinData.errorStatus === 'loginError') { // 그 에러상태가 loginError일때
        let EmptyfieldErrors = { // EmptyfieldErrors 객체(빈 username과 password)
          username: <></>,
          password: <></>
        };
        setFieldErrorMessages(EmptyfieldErrors); // 로그인에러 상태에 EmptyfieldErrors 객체 넣어줌 
        alert(signinData.error);  
      }
      return;
    }
    
    // 로그인 성공 했을때, 로컬스토리지에 accessToken 저장
    // siginData가 true일 때, 로컬 스토리지 안에 키값은 "accessToken", value값은 Bearer를 붙인 accessToken을 담음
    localStorage.setItem("accessToken", "Bearer " +  signinData.token.accessToken);

    // 로컬스토리지안에 getItem했을때 null이면 계속 null인 상태, 그래서 요청때 아래의 설정을 통해서 값 덮어쓰기
    // 기존의 config -> baseUR, headers를 매개변수로 들고와서 
    // headers를 바꿔주겠다하고 return config을 하게 되면 설정이 완료됨
    instance.interceptors.request.use(config => { 
      config.headers["Authorization"] = localStorage.getItem("accessToken"); 
      return config;
    }); 

    if(window.history.length > 2) {               
      navigate(-1); // 뒤로가기 ex) tab -> index -> login / length가 3 뒤로가기 하면 index 
      return;       // 아래의 navigate("/") 때문에 홈화면으로 이동한게 아님           
    }

    // useNavigate(); 을 쓰게 되면 상태가 유지되기때문에 토큰이 로컬스토리지에 저장이 안됨 
    // navgate을 쓰면 상태를 유지, window~ 완전히 새로운 페이지 
    navigate("/");
  }



  return (
    <div css={s.layout}>
      {/* 사이트 로고 누르면 홈페이지로(indexPage로) */}
      <Link to={"/"}><h1 css={s.logo}>사이트 로고</h1></Link> 
      <div css={s.loginInfoBox}>
        <div>
          <input type="text" name="username" 
            onChange={handleInputUserOnchange} value={inputUser.username} placeholder='아이디'/>
            {fieldErrorMessages.username}
        </div>
        <div>
          <input type="password" name="password" 
            onChange={handleInputUserOnchange} value={inputUser.password} placeholder='비밀번호'/>
            {fieldErrorMessages.password}
        </div>
      </div>    
      <button css={s.loginButton} onClick={handleLoginSubmitOnClick}>로그인</button>
      <a href="http://localhost:8080/oauth2/authorization/google">구글 로그인</a>
      <a href="http://localhost:8080/oauth2/authorization/naver">네이버 로그인</a>
      <a href="http://localhost:8080/oauth2/authorization/kakao">카카오 로그인</a>
    </div>
  )
}

export default UserLoginPage;