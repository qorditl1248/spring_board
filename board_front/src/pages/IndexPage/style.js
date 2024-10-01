import { css } from "@emotion/react";

export const layout = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 100px 300px;
`;

export const header = css`
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
  // input 박스 끝에만 둥글게 할려면, border-radius 랑 height - 50px로 잡아줌 
  & > input {
    box-sizing: border-box;
    border-radius: 50px;
    padding: 10px 20px;
    width: 50%;
    height: 50px;
  }
`;

export const main = css`
  display: flex;
  justify-content: space-between;
`;

export const leftBox = css`
  box-sizing: border-box;
  border: 2px solid #dbdbdb;
  border-radius: 10px;
  width: 64%;

  & a {
    margin-right: 10px;
  }
`;

export const rightBox = css`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 2px solid #dbdbdb;
  border-radius: 10px;
  width: 35%;
  padding: 20px;

  & > button {
    margin-bottom: 10px;
    width: 100%;
    height: 40px;
    font-size: 16px;
    font-weight: 600;
  }

  & > div {
    display: flex;
    justify-content: center;
    width: 100%;
    
    // link태그(a 태그) 중에 마지막의 첫번째가 아니면 그 앞에 내용을 만들어서 넣어라 
    & > a:not(:nth-last-of-type(1))::after { 
    display: inline-block;
    margin: 0px 5px;
    content: "";
    height: 60%;
    border-left: 1px solid #222222;
  }
}

`;

export const userInfoBox = css`
  display: flex;
  justify-content: flex-start;
  width: 100%;
`;

export const profileImgBox = css`
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  width: 64px;
  height: 64px;
  box-shadow: 0px 0px 2px #00000088;
  cursor: pointer;
  overflow: hidden;
  & > img {
    height: 100%;
  }
`;

export const profileInfo = css`
  box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    flex-grow: 1;
    padding: 10px;

    & > button {
      box-sizing: border-box;
      border: 1px solid #dbdbdb;
      border-radius: 37px;
      padding: 5px 10px;
      height: 37px;
      background-color: #ffffff;
      color: #555555;
      font-size: 16px;
      cursor: pointer;
    }
`;
