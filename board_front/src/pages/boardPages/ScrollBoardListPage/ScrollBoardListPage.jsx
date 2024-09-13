import React, { useEffect, useRef } from 'react'
/** @jsxImportSource @emotion/react */
import * as s from './style';
import { Link, useNavigate } from 'react-router-dom';
import { IoLogoReddit } from "react-icons/io5";
import { IoMdHeart } from 'react-icons/io';
import { useInfiniteQuery } from 'react-query';
import { instance } from '../../../apis/util/instance';

// 무한 스크롤 
function ScrollBoardListPage(props) {
  
  const navigate = useNavigate();
  const loadMoreRef = useRef(null);
  const limit = 20;

  // useInfiniteQuery -> 무한 스크롤을 할때 사용하는 쿼리
  // pageParam이 null이거나 false면 요청이 날라가지 않음 
  const boardList = useInfiniteQuery(
    ["boardScrollQuery"],
    async ({ pageParam = 1 }) => await instance.get(`/board/list?page=${pageParam}&limit=${limit}`),
    {      
      // 응답에 성공하면 밑에 param이 실행, lastPage: boards, totalCount || allPage: 응답을 받을때마다 배열안에 저장해둠
      getNextPageParam: (lastPage, allPage) => { // 현재 응답받은 데이터와 데이터가 들어간 배열을 받음
        const totalPageCount = lastPage.data.totalCount % limit === 0
          ? lastPage.data.totalCount / limit
          : Math.floor(lastPage.data.totalCount / limit) + 1;

        return totalPageCount !== allPage.length ? allPage.length + 1 : null; // 다르면 해당 페이지에서 + 1, 같으면 마지막페이지 
      }
    }
  );

  useEffect(() => {
    if(!boardList.hasNextPage || !loadMoreRef.current) {
      return;
    }

    const observer = new IntersectionObserver(([intersectionObserver]) => {
      if (intersectionObserver.isIntersecting) {
        boardList.fetchNextPage();
      }
    }, {threshold: 1.0}); // threshold -> 보여지는 범위, 민감도라 생각

    observer.observe(loadMoreRef.current); // 맨밑에 들어있는 div을 감시

    return () => observer.disconnect();

  }, [boardList.hasNextPage]);

  return (
    <div css={s.layout}>
      <Link to={"/"}><h1><IoLogoReddit/></h1></Link>
      <ul css={s.cardLayout}>
        {
          boardList.data?.pages.map(page => page.data.boards.map(board => {

            // 이미지 잘라오기
            const mainImgStartIndex = board.content.indexOf("<img");
            let mainImg = board.content.slice(mainImgStartIndex);
            mainImg = mainImg.slice(0, mainImg.indexOf(">") + 1);
            const mainImgSrc = mainImg.slice(mainImg.indexOf("src") + 5, mainImg.length - 2)
            
            let mainContent = board.content;
            while(true) {
              const pIndex = mainContent.indexOf("<p>");
              if(pIndex === -1) {
                mainContent = "";
                break;
              }
              mainContent = mainContent.slice(pIndex + 3);
              if(mainContent.indexOf("<img") !== 0) {
                if(mainContent.includes("<img")) {
                  mainContent = mainContent.slice(0, mainContent.indexOf("<img"));
                }
                mainContent = mainContent.slice(0, mainContent.indexOf("</p>"));
                break;
              }
            }
            
            return (
              <li key={board.id} css={s.card} onClick={() => navigate(`/board/detail/${board.id}`)}>
                <main css={s.cardMain}>
                  {
                    mainImgStartIndex !== -1 &&
                    <div css={s.cardImg}>
                      <img src={mainImgSrc} alt="" />
                    </div>
                  }
                  <div css={s.cardContent(mainImgStartIndex !== -1)}>
                    <h3>{board.title}</h3>
                    <div dangerouslySetInnerHTML={{ __html: mainContent }}></div>
                  </div>
                </main>
                <footer css={s.cardFooter}>
                  <div>
                    <img src={board.writerProfileImg} alt="" />
                    <span>by</span>
                    {board.writerName}
                  </div>
                  <div><IoMdHeart/><span>{board.likeCount}</span></div>
                </footer>
              </li>
            )
          }))
        }
      </ul>
      <div ref={loadMoreRef}></div>
    </div>
  );
}

export default ScrollBoardListPage