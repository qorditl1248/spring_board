import { css } from "@emotion/react";

export const layout = css`
  display: flex;
  flex-direction: column;
  margin: 0px auto;
  width: 460px;
`;

export const logo = css`
  font-size: 24px;
  margin-bottom: 40px;
`;

export const joinInfoBox = css`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  width: 100%;

  & input {
    box-sizing: border-box;
    border: none;
    width: 100%;
    height: 50px;
    outline: none;
    font-size: 16px;
  }

  /*  메세지들  */
  & p {
    margin: 0px 0px 10px 10px;
    font-size: 12px;
    color: #ff2f2f;
  }

  & div {
    box-sizing: border-box;
    padding: 0px 20px;
    border: 1px solid #dbdbdb;
    border-bottom: none;
    width: 100%;
  }

  & div:nth-of-type(1) {
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  }

  & div:nth-last-of-type(1) {
    border-bottom: 1px solid #dbdbdb;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
  }
`;

export const joinButton = css`
  border: none;
  border-radius: 10px;
  width: 100%;
  height: 50px;
  background-color: #999999;
  color: #ffffff;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
`;

export const selectMenuBox = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  width: 100%;

  & > input {
    display: none;
  }

  & > label {
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
    border: 1px solid #dbdbdb;
    height: 40px;
    cursor: pointer;
  }

  & > label:nth-of-type(1) {
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
  }

  & > label:nth-last-of-type(1) {
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
  }

  & > input:checked + label { // input에 체크 된 인접형제 레이블
    background-color: #fafafa;
    box-shadow: 0px 0px 5px #00000033 inset;
  }
`;