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

export const loginInfoBox = css`
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

  /*  반복돌려서 에러메세지들 띄워주는거  */
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

export const loginButton = css`
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