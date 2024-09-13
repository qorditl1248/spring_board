import { css } from "@emotion/react";

export const layout = css`
  margin: 0px auto;
  width: 1030px;
`;

export const cardLayout = css`
  display: flex;
  flex-wrap: wrap;
  padding: 0; // ul이 기본적으로 padding 가지고있음
  padding-top: 50px;
  border-top: 3px solid #dbdbdb;
  width: 100%;
  list-style-type: none;
`;

export const card = css`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  margin: 0px 0px 20px;
  width: 330px;
  height: 330px;
  box-shadow: 0px 3px 5px #00000011;
  transition: all 0.3s ease-in-out;
  cursor: pointer;

  &:nth-of-type(3n - 1) { 
    margin: 0px 20px 40px;
  }

  &:hover {
    transform: translateY(-5%);
    box-shadow: 0px 3px 10px #00000011;
  }
`;

export const cardMain = css`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

export const cardImg = css`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 170px;
  overflow: hidden;
  background-color: #000000;

  & > img {
    width: 100%;
  }
`;

export const cardContent = (isShowImg) => css`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 10px;

  & > h3 {
    margin: 0px 0px 4px;
    width: 100%;
    overflow: hidden; 
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  & > div { // 글 내용이 들어감 
    display: -webkit-box;
    overflow: hidden;
    word-break: break-all;
    -webkit-line-clamp: ${isShowImg ? 3 : 11};
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;

    & > * {
      margin: 0;
      font-size: 16px;
      font-weight: 400;
    }
  }
`;

export const cardFooter = css`
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #f5f5f5;
  padding: 0px 15px;
  height: 50px;

  & > div:nth-of-type(1) { // useranme
    display: flex;
    align-items: center;
    font-weight: 600;

    & > img {
      margin-right: 5px;
      align-self: center;
      border: 1px solid #dbdbdb;
      border-radius: 50%;
      width: 25px;
      height: 25px;
    }

    & > span {
      margin-right: 8px;
      font-weight: 400;
      font-size: 14px;
      color: #999999;
    }
  }

  & > div:nth-of-type(2) { // 좋아요 수 
    display: flex;
    align-items: center;
  }
`;

