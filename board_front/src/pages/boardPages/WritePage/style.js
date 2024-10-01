import { css } from "@emotion/react";

export const layout = css`
  box-sizing: border-box;
  padding-top: 30px;
  margin: 0px auto;
  width: 1100px;
`;
export const header = css`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin: 10px 0;

  & > h1 {
    margin: 0;
  }

  & > button {
    box-sizing: border-box;
    border: 1px solid #c0c0c0;
    background-color: white;
    padding: 10px 15px;
    height: 40px;
    font-size: 12px;
    color: #333333;
    font-weight: 600;
    cursor: pointer;

    &:hover {
      background-color: #fafafa;
    }

    &:active {
      background-color: #eeeeee;
    }
  }
`;

export const titleInput = css`
  box-sizing: border-box;
  margin-bottom: 10px;
  border: 1px solid #c0c0c0;
  outline: none;
  padding: 12px 15px;
  width: 100%;
  font-size: 16px;
`;



export const editerLayout = css`
  box-sizing: border-box;
  margin-bottom: 42px; // 글작성 밑에 확인버튼 넣거나 하고싶으면 margin으로 밀고 아래 작성하면 클릭 됨 
  width: 100%;
  height: 700px;
`;

export const loadingLayout = css`
  position: absolute;
  left: 0;
  top: 0;
  z-index: 99;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #00000033;
`;


