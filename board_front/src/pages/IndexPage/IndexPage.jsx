import React, { useState } from 'react'
/** @jsxImportSource @emotion/react */
import { Link, useNavigate } from 'react-router-dom';
/** @jsxImportSource @emotion/react */
import * as s from './style';
import { useQueryClient } from 'react-query';

// 전체 홈 화면 페이지  
// 로그인 버튼 누르면 로그인페이지로 넘어가게 
function IndexPage(props) {
  
  const navigate = useNavigate();

  // 로그인 버튼 클릭 시, 로그인 페이지로 이동 
  const handleLoginButtonOnClick = () => {
    navigate("/user/login");
  } 

  // 로그아웃 버튼 클릭 시, 홈페이지로 이동 
  const handleLogoutButtonOnClick = () => {
    localStorage.removeItem("accessToken"); // 로컬스토리지안에 있는 accessToken 지우기 
    if(window.confirm("로그아웃하시겠습니까? ")) {
      window.location.replace("/");
    }
    return;
  };


  // const queryClient = queryClient.getQueryData("accessTokenValidQuery"); - 가지고 오고 싶은 쿼리 키값을 적어주면 됨 
  // const state = queryClient.getQueryData("accessTokenValidQuery"); - 데이터를 포함한 상태를 가져옴, 그래서 더 많은 걸 꺼내쓸 수 있음 
  // queryClient.invalidateQueries(); - 내가 지금까지 들고온 쿼리들 다 만료시켜버리는 (특별한 동작이 있을때 사용)
  // status: idle - 요청 준비중

  const queryClient = useQueryClient();

  const accessTokenValidState = queryClient.getQueryState("accessTokenValidQuery");
  
  const userInfoState = queryClient.getQueryState("userInfoQuery");

  const [ searchValue, setSearchValue ] = useState("");


  
  const handleSearchInputOnChange = (e) => {
    setSearchValue(e.target.value);
  } 

  const handleSearchInputOnKeyDown = (e) => {
    if(e.keyCode === 13) { 
      navigate(`/board/search?page=1&option=all&search=${searchValue}`);
    }
  }

  
  return (
    <div css={s.layout}>
      
      <header css={s.header}>
        <input type='search' placeholder='검색어를 입력해 주세요' 
          onChange={handleSearchInputOnChange} 
          onKeyDown={handleSearchInputOnKeyDown}/>
      </header>

      <main css={s.main}>
        <div css={s.leftBox}>
          
          <Link to={"/board/number?page=1"}>게시글 번호</Link>
          <Link to={"/board/scroll"}>게시글 스크롤</Link>
          <Link to={"/board/search?page=1"}>게시글 검색</Link>
          <Link to={"/board/write"}>글쓰기</Link>
          <Link to={"/mail"}>메일전송</Link>
          
        </div>
        { // 성공상태가 아니면 바로 회원가입화면으로, 성공상태가 맞다면 error가 아닌지 확인 
          accessTokenValidState.status !== "success"
          ?  
            accessTokenValidState.status !== "error"
            ?
            <></>
            :
            <div css={s.rightBox}>
              <p>더 안전하고 편리하게 이용하세요</p>
              <button onClick={handleLoginButtonOnClick}>로그인</button> 
              <div>
                <Link to={"/user/help/id"}>아이디 찾기</Link>
                <Link to={"/user/help/pw"}>비밀번호 찾기</Link>
                <Link to={"/user/help/join"}>회원가입</Link>
              </div>
            </div>
            :
            <div css={s.rightBox}> 
              <div css={s.userInfoBox}>
                <div css={s.profileImgBox} onClick={() => navigate("/profile")}>
                  <img src={userInfoState?.data?.data.img} alt="" />
                </div>
                <div css={s.profileInfo}>
                  <div>
                    <div>{userInfoState.data?.data.username}님</div>
                    <div>{userInfoState.data?.data.email}</div>
                  </div>
                  <button onClick={handleLogoutButtonOnClick}>로그아웃</button>
                </div>
              </div>
            </div>
        }
      </main>
    </div>
  )
}

export default IndexPage;