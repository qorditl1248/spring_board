import { css } from "@emotion/react";

export const imgBox = css`
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  width: 300px;
  height: 300px;
  box-shadow: 0px 0px 2px #00000088;
  cursor: pointer;
  overflow: hidden;

  & > img {
    height: 100%;
  }
`;

export const progressBox = css`
  padding-top: 20px;
  width: 300px;
`;


export const layout = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 100px auto;
  width: 1000px;
`;