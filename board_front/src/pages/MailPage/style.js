import { css } from "@emotion/react";

export const layout = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 700px;
  margin: 50px auto;

  & * {
    box-sizing: border-box;
    margin-bottom: 10px;
    padding: 10px 15px;
    width: 100%;
    font-size: 16px;
  }

  & input {
    height: 40px;
  }

  & textarea {
    height: 500px;
  }

  & button {
    height: 40px;
    cursor: pointer;
  }

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

