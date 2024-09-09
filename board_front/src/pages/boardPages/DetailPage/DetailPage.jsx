import React from 'react'
/** @jsxImportSource @emotion/react */
import * as s from './style';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { instance } from '../../../apis/util/instance';
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";

function DetailPage(props) {

  const navigate = useNavigate();
  const params = useParams();
  const boardId = params.boardId; // boardId를 꺼내올 수 있음
  const queryClient = useQueryClient(); // app.js에 있는 
  const userInfoData = queryClient.getQueryData("userInfoQuery");
  
  //  서버에서 가지고 오는 상태 -> useQuery (서버에서 get 요청할때 - useQuery)
  const board = useQuery( 
    [ "boardQuery ", boardId], // boardId가 바뀔때마다 동작
    async() => {
      return instance.get(`/board/${boardId}`);
    }, 
    {
      refetchOnWindowFocus: false,
      retry: 0,
    }
  );       
  
  // 좋아요 수 
  const boardLike = useQuery(
    ["boardLikeQuery"],
    async() => {
      return instance.get(`/board/${boardId}/like`);
    },
    {
      refetchOnWindowFocus: false,
      retry: 0,
    }
  )

  // useMutation -> useQuery같은거라고 생각하면 됨 (1- 매개변수, 2- 함수, 3-옵션)
  // 좋아요 누른거 
  const likeMutation = useMutation(
    async () => {
      return await instance.post(`/board/${boardId}/like`);
    },
    {
      onSuccess: response => {
        boardLike.refetch();  // 좋아요수 다시 불러오기
      }
    }
  ); 

  // 좋아요 삭제 
  const dislikeMutation = useMutation(
    async () => {
      return await instance.delete(`/board/like/${boardLike.data?.data.boardLikeId}`);
    },
    {
      onSuccess: response => {
        boardLike.refetch();
      }
    }
  ); 



  // 좋아요 누른거
  const handleLikeOnClick = () => {
    if(!userInfoData?.data) {
      if(window.confirm("로그인 후 가능합니다. 로그인페이지로 이동 하시겠습니까?")) {
        navigate("/user/login");
      };  
      return;
    }
    likeMutation.mutateAsync(); // 비동기로 요청 날림 
  }

  const handleDisLikeOnClick = () => {
    dislikeMutation.mutateAsync();
  }

  return (
    <div css={s.layout}>
      <Link to={"/"}><h1>사이트 로고</h1></Link>
      {
        board.isLoading && <></> 
      }
      {
        board.isError && <h1>{board.error.response.data}</h1>
      }
      {
        board.isSuccess && 
        <>
          <div css={s.header}>
            <div css={s.titleAndLike}>
                <h1>{board.data.data.title}</h1>
                <div>
                  {
                    !!boardLike?.data?.data?.boardLikeId
                    ?
                    <button onClick={handleDisLikeOnClick}>
                      <IoMdHeart/>
                    </button>
                    :
                    <button onClick={handleLikeOnClick}>
                      <IoMdHeartEmpty/>
                    </button>
                  }
                </div>
            </div>
            <div css={s.boardInfoContainer}>
              <div>
                <span>
                  작성자: {board.data.data.writerUsername}
                </span>
                <span>
                  조회수: {board.data.data.viewCount}
                </span>
                <span>
                  추천수: {boardLike?.data?.data.likeCount}
                </span>
              </div>
              <div>
                {
                  board.data.data.writerId === userInfoData?.data.userId && 
                  <>
                    <button>수정</button>
                    <button>삭제</button>
                  </>
                }
              </div>
            </div>
          </div>
          <div>
            <div css={s.contentBox} dangerouslySetInnerHTML={{ // innerhtml이랑 똑같음 
              __html: board.data.data.content
            }}></div>
          </div>
          <div>
            <div css={s.commentWriteBox}>
              <textarea name="" placeholder='댓글을 입력하세요'></textarea>
              <button>작성하기</button>
            </div>
          </div>
        </>
      }
    </div>
  )
}

export default DetailPage;