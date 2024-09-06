import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import './App.css';
import IndexPage from './pages/IndexPage/IndexPage';
import UserJoinPage from './pages/UserJoinPage/UserJoinPage';
import UserLoginPage from './pages/UserLoginPage/UserLoginPage';
import { useQuery } from 'react-query';
import { instance } from './apis/util/instance';
import UserProfilePage from './pages/UserProfilePage/UserProfilePage';
import { useEffect, useState } from 'react';
import OAuth2JoinPage from './pages/OAuth2JoinPage/OAuth2JoinPage';
import OAuth2LoginPage from './pages/OAuth2LoginPage/OAuth2LoginPage';
import WritePage from './pages/boardPages/WritePage/WritePage';
import TestPage from './pages/TestPage';

function App() {

    /*
    * 페이지 이동시 Auth(로그인, 토큰) 확인 
    1. index(home) 페이지를 먼저 들어가서 로그인 페이지로 이동한 경우 -> 홈(index)으로 이동
    2. 탭을 열자마자 주소창에 수동입력을 통해 로그인 페이지로 이동한 경우 -> 홈(index)으로 이동
    3. 로그인 후 사용 가능한 페이지로 들어갔을 때 로그인 페이지로 이동한 경우 -> 로그인 후 이전 페이지로 이동 
    4. 로그인이 된 상태 -> 어느 페이지든 이동 가능
    */

    const location = useLocation();
    const navigate = useNavigate();
    const [ authRefresh, setAuthRefresh ] = useState(true);

    // 경로이동이 일어날 때마다 토큰 검사
    useEffect(() => { 
        if(!authRefresh) {      
            setAuthRefresh(true);
        }
    }, [location.pathname]);

    // -- useQuery 속성들 -- 
    // 모든 요청들은 enabled가 true 일 때 동작
    // refetch - 재요청 
    // retry - 요청 실패했을 때 다시 요청 날릴거냐 
    // refetchInterval - 시간마다 다시 재요청  


    // 한번 로그인하고 나면, 로컬스토리지에 accesstoken을 넣어둠 
    // -> 즉, 이 토큰이 유효한지에 대한 요청, 로컬스토리지에서 값이 변할때마다 바꿔줘야함 

    const accessTokenValid = useQuery(
        ["accessTokenValidQuery"], // [첫번째 쿼리키값, 두번쨰는 [dependency]]
        async () => { 
            setAuthRefresh(false); // setRefresh가 true일때 동작하고 끝나고 false으로 상태 바꿈 

            // 여기가 try, catch 형태 (성공이면 onSuccess으로 응답, 에러면 onError로 응답)
            return await instance.get("/auth/access", { 
                params: {
                    accessToken: localStorage.getItem("accessToken")
                }
            });
            }, 
        {    
            enabled: authRefresh,       // authRefresh가 true일때 요청 날라감 
            retry: 0, 
            refetchOnWindowFocus: false, // 다른 페이지나 다른 탭을 갔다오거나 등은 렌더링이 되지않게 
            onSuccess: response => {     // 로그인 성공 된 상태로 회원가입이나 로그인 페이지로 이동못하게 하는 거 
                const permitAllPaths = ["/user"]; 
                for(let permitAllPath of permitAllPaths) { 
                    if(location.pathname.startsWith(permitAllPath)) {
                        navigate("/");                   
                        break;                                   
                    }
                }
            },
            onError: error => {   // 응답이 에러인데 그때 /profile 주소로 시작하는거라면 로그인 페이지로 보내줌
                const authPaths = ["/profile"]; 
                for(let authPath of authPaths) { 
                    if(location.pathname.startsWith(authPath)) { 
                        navigate("/user/login");                
                        break;                                   
                    }
                }
            }
        }
);

    // user 정보 가져오기, user 객체 가지고 오는 요청 
    const userInfo = useQuery(
        [ "userInfoQuery" ],
        async () => {
            return await instance.get("/user/me"); 
        },
        {
            // accessTokenValid.data.data -> axios가 응답을 줘야 생김, 데이터 안에 값이 존재하면 뒤에 참조 아니면 참조 x 
            // enabled가 없으면, accessToken이 유효한지도 따지지않고 요청 보내질 수 있음 
            enabled: accessTokenValid.isSuccess && accessTokenValid.data?.data, 
            refetchOnWindowFocus: false
        }
    );

    return (
            <Routes>
                {/* 홈페이지 */}
                <Route path='/' element={ <IndexPage/> } /> 
                {/* 회원가입 */}
                <Route path='/user/join' element={ <UserJoinPage/> } />
                {/* oauth2 통합&회원가입 페이지 */}
                <Route path='/user/join/oauth2' element={ <OAuth2JoinPage/> } />
                {/* 로그인 */}
                <Route path='/user/login' element={ <UserLoginPage/> } />
                {/* oauth2 로그인 페이지*/}
                <Route path='/user/login/oauth2' element={ <OAuth2LoginPage/> } />
                {/* 프로필 */}
                <Route path='/profile' element={ <UserProfilePage/> } />


                {/* 게시판 목록 페이지*/}
                <Route path='/board' element={<></>} />
                {/* 게시판 글쓰기 */}
                <Route path='/board/write' element={<WritePage/>} />


                <Route path='/test' element={<TestPage/>} />


                <Route path='/admin/*' element={ <></> } />
                <Route path='/admin/*' element={ <h1>Not Found</h1> } />
                <Route path='*' element={ <h1>Not Found</h1> } />
            </Routes>
    );
}

export default App;
