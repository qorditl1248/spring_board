import axios from "axios";

// 기본 경로 설정
// 처음 렌더링 됐을 때 셋팅 됨 -> 처음에는 accessToken은 null 임 
// 로그인해서 token이 생겨도 여기는 처음 한번만 렌더링 되기 때문에 값이 바뀌지 않음 
export const instance = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    Authorization: localStorage.getItem("accessToken"),
  }
});