import { css } from "@emotion/react";

export const layout = css`
  box-sizing: border-box;
  margin: 50px auto 300px;
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

export const commentContainer = css`
  margin-bottom: 50px;
`;

export const commentWriteBox = (level) => css`
  box-sizing: border-box;
  display: flex;
  margin-top: 5px;
  margin-left: ${level * 3}%;
  height: 80px;

  & > textarea {
    flex-grow: 1;
    border: 1px solid #dbdbdb;
    margin-right: 5px;
    padding: 12px 15px;
    outline: none;
    resize: none;
  }

  & > button {
    box-sizing: border-box;
    border: 1px solid #dbdbdb;
    width: 80px;
    background-color: #ffffff;
    cursor: pointer;
  }
`;

export const commentListContainer = (level) => css` // level 몇번째 자식인지 체크해서 마진이 들어가게 
  box-sizing: border-box;                           // 부모는 0 
  display: flex;
  align-items: center;
  margin-left: ${level * 3}%;
  border-bottom: 1px solid #dbdbdb;
  padding: 12px 15px;

  & > div:nth-of-type(1) {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 12px;
    border: 1px solid #dbdbdb;
    border-radius: 50%;
    width: 70px;
    height: 70px;
    overflow:  hidden;
    & > img {
      height: 100%;
    }
  }
`;

export const commentDetail = css`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

export const detailHeader = css`
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;

  & > span:nth-of-type(1) {
    font-weight: 600;
    cursor: default;
  }
`;

export const detailContent = css`
  margin-bottom: 10px;
  max-height: 50px;
  overflow-y: auto;
`;

export const detailButtons = css`
  display: flex;
  justify-content: flex-end;
  width: 100%;

  & button {
    box-sizing: border-box;
    margin-left: 4px;
    padding: 5px 10px;
    border: 1px solid #dbdbdb;
    background-color: white;
    cursor: pointer;

    &:hover {
      background-color: #fafafa;
    }

    &:active {
      background-color: #f9f9f9;
    }
}
`;