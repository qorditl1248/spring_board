import React from "react";
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

const layout = css`
  box-sizing: border-box; /* 패딩과 보더 포함 */
  border: 1px solid black;
  width: 80vh;
  height: 100%;
  margin: 0 auto;
`;

function Starbucks() {
  return (
    <div css={layout}>
      <div>ㅇㅇㅇㅇㅇㅇㅇㅇ</div>
      <div></div>
      <div>
        <p>메뉴1</p>
        <p>메뉴1</p>
        <p>메뉴1</p>
        <p>메뉴1</p>
        <p>메뉴1</p>
        <p>메뉴1</p>
        <p>메뉴1</p>
        <p>메뉴1</p>
      </div>
      <div></div>
    </div>
  );
}

export default Starbucks;
