/** @jsxImportSource @emotion/react */
import * as s from './style';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { signupApi } from '../../apis/signupApi';
import { useMutation } from 'react-query';
import { instance } from '../../apis/util/instance';
/** @jsxImportSource @emotion/react */


// user 회원가입 페이지 
function UserJoinPage(props) {

  const navigate = useNavigate();


  // 입력받는 user 정보들 상태 
  const [ inputUser, setInputUser ] = useState({
    username: "",
    password: "",
    checkPassword: "",
    name: "",
    email: ""
  });

  // 에러 메세지들 상태 
  const [ fieldErrorMessages, setFieldErrorMessages ] = useState({
    username: <></>,
    password: <></>,
    checkPassword: <></>,
    name: <></>,
    email: <></>
  });

  const sendMail = useMutation(
    async ({toEmail, username}) => {
      return await instance.post("/auth/mail", {toEmail, username}); 
    }
  )


  // 입력받은 user 정보들 set
  const handleInputUserOnchange = (e) => {
    setInputUser(inputUser => ({
      ...inputUser,
      [e.target.name] : e.target.value
    })); 
  }

  // 가입하기 버튼 클릭(inputUser 넘겨줌)  
  const handleJoinSubmitOnclick = async() => {
    const signupData = await signupApi(inputUser);

    // isSucess가 false일 때 showFieldErrorMessage에 에러데이터 넣어줌
    if(!signupData.isSuceess) {
      showFieldErrorMessage(signupData.fieldErrors);
      return;
    };
    
    const toEmail = signupData.ok.user.email;
    const username = signupData.ok.user.username;

    console.log(toEmail);
    console.log(username);

    await sendMail.mutateAsync({toEmail, username}); // mutation -> 두개 이상 보낼때는 객체형태로 보내줌

    // 회원가입 성공(isSucess가 true) 했을 때 로그인 페이지로 이동 
    alert(`${signupData.ok.message}`);

    navigate("/user/login"); 
  };

  // fieldErrors 배열로 들고와서 key,value 형태로 
  const showFieldErrorMessage = (fieldErrors) => { 

    // 처음에는 비어져있음 
    let EmptyfieldErrors = {
      username: <></>,
      password: <></>,
      checkPassword: <></>,
      name: <></>,
      email: <></>
    };

    for(let fieldError of fieldErrors) { // fieldErrors를 반복돌려서 field이름이랑 default 메세지
      EmptyfieldErrors = {
        ...EmptyfieldErrors,
        [fieldError.field] : <p>{fieldError.defaultMessage}</p>,
      }
    }

    setFieldErrorMessages(EmptyfieldErrors);
  }


  return (
    <div css={s.layout}>
      {/* 사이트 로고 누르면 홈페이지로(indexPage로) */}
      <Link to={"/"}><h1 css={s.logo}>사이트 로고</h1></Link> 
      <div css={s.joinInfoBox}>
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
        <div>
          <input type="passwrod" name="checkPassword" 
            onChange={handleInputUserOnchange} value={inputUser.checkPassword}  placeholder='비밀번호 확인' />
            {fieldErrorMessages.checkPassword}
        </div>
        <div>
          <input type="text" name="name" 
            onChange={handleInputUserOnchange} value={inputUser.name} placeholder='성명'/>
            {fieldErrorMessages.name}
        </div>
        <div>
          <input type="email" name="email" 
            onChange={handleInputUserOnchange} value={inputUser.email} placeholder='이메일주소'/>
            {fieldErrorMessages.email}
        </div>
      </div>    
      {/* 가입하기 버튼 누르면 요청갔다가 응답으로 들고   */}
      <button css={s.joinButton} onClick={handleJoinSubmitOnclick}>가입하기</button>
    </div>
  )
}

export default UserJoinPage;