import { css } from "@emotion/react";

export const layout = css`
  box-sizing: border-box;
  margin: 50px auto 0px;
  width: 1100px;
`;

export const header = css`
  box-sizing: border-box;
  border: 1px solid #dbdbdb;
  padding: 10px 15px;

  & > h1 {
    margin: 0;
    margin-bottom: 15px;
    font-size: 38px;
    cursor: default;
  }

`;

export const titleAndLike = css`
  display: flex;
  justify-content: space-between;
  align-items: center;

  & button {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    border: none;
    background-color: #ffffff;
    cursor: pointer;

    & > svg {
      font-size: 30px;
    }
  }

`;

export const boardInfoContainer = css`
  display: flex;
  justify-content: space-between;
  
  & span {
    margin-right: 10px;
    font-size: 14px;
    font-weight: 600;
    cursor: default;
  }

  & button {
    box-sizing: border-box;
    margin-left: 5px;
    border: 1px solid #dbdbdb;
    padding: 5px 20px;
    background-color: white;
    font-size: 12px;
    font-weight: 600;
    color: #333333;
    cursor: pointer;

    &:hover {
      background-color: #fafafa;
    }

    &:hover {
      background-color: #eeeeee;
    }
  }
`;

export const contentBox = css`
  box-sizing: border-box;
  margin-top: 5px;
  border: 1px solid #dbdbdb;
  padding: 0px 15px;
  & img:not(img[width]) { // 크기조절을 했으면 적용 x, 크기조절 속성이 없으면 적용해라 
    width: 100%;
  }
`;

export const commentWriteBox = css`
  box-sizing: border-box;
  display: flex;
  margin-top: 5px;
  border: 1px solid #dbdbdb;
  width: 100%;
  height: 80px;

  & > textarea {
    flex-grow: 1;
    margin-right: 5px;
    outline: none;
    resize: none;
    padding: 12px 15px;
  }

  & > button {
    box-sizing: border-box;
    border: 1px solid #dbdbdb;
    width: 80px;
    background-color: #ffffff;
    cursor: pointer;
  }
`;
