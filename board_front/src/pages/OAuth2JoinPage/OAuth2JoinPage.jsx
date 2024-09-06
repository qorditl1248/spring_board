import React, { useState } from 'react'
/** @jsxImportSource @emotion/react */
import * as s from './style';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { oauth2JoinApi, oauth2MergeApi } from '../../apis/oauth2Api';


function OAuth2JoinPage() {

  // 선택 메뉴 상태 
  const [ selectMenu, setSelectMenu ] = useState("merge");

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();


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

  // 입력받은 user 정보들 set
  const handleInputUserOnchange = (e) => {
    setInputUser(inputUser => ({
      ...inputUser,
      [e.target.name] : e.target.value
    })); 
  }

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
        [fieldError.field] : <p>{fieldError.defaultMessage}</p>
      }
    }

    setFieldErrorMessages(EmptyfieldErrors);
  }

  // 계정 통합 & 회원가입 메뉴 클릭 
  // InputUser 상태 초기화 - 사용자가 입력한 정보를 초기화
  const handleSeletMenuOnChange = (e) => {
    setInputUser({
      username: "",
      password: "",
      checkPassword: "",
      name: "",
      email: ""
    });
  
    setFieldErrorMessages({
      username: <></>,
      password: <></>,
      checkPassword: <></>,
      name: <></>,
      email: <></>
    });
  
    setSelectMenu(e.target.value);
  }

  // 계정 통합하기 버튼 클릭 
  const handleMergeSumbiOnClick = async() => {
    const mergeUser = {
      username: inputUser.username,
      password: inputUser.password,
      oauth2Name: searchParams.get("oAuth2Name"),
      provider: searchParams.get("provider")
    }

    const mergeData = await oauth2MergeApi(mergeUser);
    if(!mergeData.isSuceess) {
      if(mergeData.errorStatus === "loginError") {
        alert(mergeData.error);
        return;
      }
      if(mergeData.errorStatus === "fieldError") {
        showFieldErrorMessage(mergeData.error);
        return;
      }
    }
    alert("통합하기가 완료되었습니다.");
    navigate("/user/login");    // 통합하기완료되면 login페이지로 이동
  }

  // 가입하기 버튼 클릭 
  const handleJoinSumbitOnClick = async() => {
    const joinUser = {
      ...inputUser,
      oauth2Name: searchParams.get("oAuth2Name"),
      provider: searchParams.get("provider")
    }
    
    const joinData = await oauth2JoinApi(joinUser);

    if(!joinData.isSuceess) {
      showFieldErrorMessage(joinData.fieldErrors);
      return;
    };

    alert("가입 완료!");
    navigate("/user/login"); 
  }


  return (
    <div css={s.layout}>
      <Link to={"/"}><h1 css={s.logo}>사이트 로고</h1></Link> 
      <div css={s.selectMenuBox}>
        <input type="radio" id='merge' name='selectMenu' 
          value="merge" checked={selectMenu === "merge"}
          onChange={handleSeletMenuOnChange}
        />
        <label htmlFor="merge">계정통합</label>

        <input type="radio" id='join' name='selectMenu' 
          value="join" checked={selectMenu === "join"}
          onChange={handleSeletMenuOnChange}
        />
        <label htmlFor="join">회원가입</label>
      </div>
      {
        selectMenu === "merge"
        ?
        <>
          <div css={s.joinInfoBox}>
            <div>
              <input type="text" name='username' onChange={handleInputUserOnchange} value={inputUser.username} placeholder='아이디' />
              {fieldErrorMessages.username}
            </div>
            <div>
              <input type="password" name='password' onChange={handleInputUserOnchange} value={inputUser.password} placeholder='비밀번호' />
              {fieldErrorMessages.password}
            </div>
            <button css={s.joinButton} onClick={handleMergeSumbiOnClick}>계정 통합하기</button>
          </div>
        </>
        :
        <>
          <div css={s.joinInfoBox}>
            <div>
              <input type="text" name='username' onChange={handleInputUserOnchange} value={inputUser.username} placeholder='아이디'/>
              {fieldErrorMessages.username}
            </div>
            <div>
              <input type="password" name='password' onChange={handleInputUserOnchange} value={inputUser.password} placeholder='비밀번호' />
              {fieldErrorMessages.password}
            </div>
            <div>
              <input type="password" name='checkPassword' onChange={handleInputUserOnchange} value={inputUser.checkPassword} placeholder='비밀번호 확인' />
              {fieldErrorMessages.checkPassword}
            </div>
            <div>
              <input type="text" name='name' onChange={handleInputUserOnchange} value={inputUser.name} placeholder='성명' />
              {fieldErrorMessages.name}
            </div>
            <div>
              <input type="email" name='email' onChange={handleInputUserOnchange} value={inputUser.email} placeholder='이메일주소' />
              {fieldErrorMessages.email}
            </div>
          </div>
          <button css={s.joinButton} onClick={handleJoinSumbitOnClick}>가입하기</button>
        </>
      }
    </div>
  )
}

export default OAuth2JoinPage;