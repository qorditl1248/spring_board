import { css } from "@emotion/react";

export const paginateContainer = css`
  & > ul {
    display: flex;
    list-style: none;

    & > li {
      margin: 0px 5px;
    }
      
    & a {
      box-sizing: border-box;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid #dbdbdb;
      padding: 0px 5px;
      border-radius: 32px;
      min-width: 32px;
      height: 32px;
      line-height: 10px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      }
      
      & .active {
        border-radius: 32px;
        background-color: #dbdbdb;
        color: #ffffff;
      }
    }
`;


