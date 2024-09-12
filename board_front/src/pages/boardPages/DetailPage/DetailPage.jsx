import React, { useState } from 'react'
/** @jsxImportSource @emotion/react */
import * as s from './style';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { instance } from '../../../apis/util/instance';
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import { IoLogoReddit } from "react-icons/io5";

// 각 작성글 보기 (user)
function DetailPage(props) {

  const navigate = useNavigate();

  const params = useParams();
  const boardId = params.boardId; // URL의 동적 파라미터를 가져오는 훅
  const queryClient = useQueryClient(); // app.js에 있는 
  const userInfoData = queryClient.getQueryData("userInfoQuery");


  const [ commentData, setCommentData ] = useState({
    boardId: boardId, // 키값이랑 변수명이랑 같으면 생략 가능
    parentId: null, 
    content: "",
  });

  // 수정 상태 
  const [ commentModfiyData, setCommentModfiyData ] = useState({
    commentId: 0, 
    content: "" 
  })


  //  get 요청일때 -> useQuery 사용 (데이터를 자동으로 들고오거나, 수시로 가져올때 사용)
  const board = useQuery( 
    ["boardQuery", boardId], // boardId가 바뀔때마다 동작
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
  
    // 해당 게시물의 (boardId)의 댓글 정보들 불러오기
    const comments = useQuery(
      ["commentsQuery"],
      async () => {
        return await instance.get(`/board/${boardId}/comments`); 
      },
      {
        retry: 0
      }
    );
  

  // useMutation -> useQuery같은거라고 생각하면 됨 (1- 매개변수, 2- 함수, 3-옵션)
  // 좋아요 눌렀을때 요청 
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

  // 좋아요 삭제 눌렀을때 요청 
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

  // post, put, delete 요청일때 -> useMutaion 사용 
  // 작성된 댓글 백엔드로 요청이 날라감 
  const commentMutation = useMutation(
    async () => {
      console.log(commentData);
      return await instance.post("/board/comment", commentData);
    },
    {
      onSuccess: response => {
        alert("댓글 작성이 완료되었습니다!");
        setCommentData({
          boardId: boardId,
          parentId: null,
          content: ""
        })
        comments.refetch(); // 댓글 정보 다시 불러오기 
      }
    }
  );

  // 수정 요청이 날라감
  const modfiyCommentMutation = useMutation(
    async () => {
      return await instance.put(`/board/comment/${commentModfiyData.commentId}`, commentModfiyData);
    },
    {
      onSuccess: response => {
        alert("댓글 수정이 완료되었습니다!");
        setCommentModfiyData({
          commentId: 0,
          content: ""
        })
        comments.refetch();
      }
    }
  )

  // 댓글 삭제 요청이 날라감 
  const deleteCommentMutation = useMutation(
    async (commentId) => {  // 매개변수로 넣어주면 나중에 호출할때 넣어주면 됨 
      return await instance.delete(`/board/comment/${commentId}`);
    },
    {
      onSuccess: response => {
        alert("댓글이 정상적으로 삭제되었습니다.");
        comments.refetch(); 
      }
    }
  )
  
  // 좋아요 하트 클릭 
  const handleLikeOnClick = () => {
    if(!userInfoData?.data) {
      if(window.confirm("로그인 후 가능합니다. 로그인페이지로 이동 하시겠습니까?")) {
        navigate("/user/login");
      };  
      return;
    }
    likeMutation.mutateAsync(); // 비동기로 요청 날림 
  }

  // 좋아요 하트 취소 클릭 
  const handleDisLikeOnClick = () => {
    dislikeMutation.mutateAsync();
  }

  // 댓글 작성 input 상태 변경
  const handleCommentInputOnChange = (e) => {
    setCommentData(commentData => ({ 
      ...commentData,
      [e.target.name]: e.target.value
    }))
  };

  // 수정 input 상태 변경 
  const handleCommentModfiyInputOnChange = (e) => {
    setCommentModfiyData(commentModfiyData => ({
      ...commentModfiyData,
      [e.target.name]: e.target.value
    }))
  }


  // 댓글 작성하기 버튼 클릭 
  const handleCommentSubmitOnClick = () => {
    if(!userInfoData?.data) {   // 로그인했을때 유저 정보에 데이터의 값이 없다면 ~> 즉, 로그인이 안된 상태
      if(window.confirm("로그인 후 가능합니다. 로그인페이지로 이동 하시겠습니까?")) {
        navigate("/user/login");
      };  
      return;
    }

    if(commentData.content.trim() === "") {
      alert("빈값은 저장할 수 없습니다.");
      return;
    }

    commentMutation.mutateAsync(); // 로그인이 되어져있을 때 비동기로 동작 
  }

  // 수정하기 버튼 클릭
  const handleCommentModfiySubmitOnClick = () => {
    if(commentModfiyData.content.trim() === "") {
      alert("빈값으로 수정이 불가합니다!");
      return;
    }
    modfiyCommentMutation.mutateAsync();
  }
  
  
  // 답글 버튼 눌렀을 때 
  const handleReplyButtonOnClick = async(commentId) => {
    setCommentData(commentData => ({
      boardId: boardId,
      parentId: commentId === commentData.parentId ? null : commentId, 
      content: ""
    }));
  }

  // 수정 버튼 눌렀을때 
  const handleModfiyCommentButtonOnClick = (commentId, content) => { // 내가 수정을 누른 댓글의 아이디가 매개변수로 들어옴
    setCommentModfiyData(commentModifyData => ({
      commentId: commentId, 
      content: content
    }))
  }

  // 수정 취소버튼 눌렀을 때 
  const handleModfiyCommentCancelButtonOnClick = () => {
    setCommentModfiyData(commentModifyData => ({
      commentId: 0, 
      content: ""
    }))
  }

  // 삭제 버튼 눌렀을 때 
  const handleDeleteCommentButtonOnClick = (commentId) => {
    if(window.confirm("정말 삭제하시겠습니까? ")) {
      deleteCommentMutation.mutateAsync(commentId);
      return;
    }
  }

  return (
    <div css={s.layout}>
      <Link to={"/"}><h1><IoLogoReddit/></h1></Link>
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
          <div css={s.commentContainer}>
            <h2>댓글 {comments?.data?.data.commentCount}</h2>
            {
              commentData.parentId === null &&
              <div css={s.commentWriteBox(0)}>
                <textarea name="content" placeholder='댓글을작성하세요.' 
                  onChange={handleCommentInputOnChange} value={commentData.content} >
                </textarea>
                <button onClick={handleCommentSubmitOnClick}>작성하기</button>
              </div>
            }
            <div> 
              { // 댓글리스트를 map 돌려서 꺼냄
                comments?.data?.data.comments.map(comment => 
                  <div key={comment.id}>
                    <div css={s.commentListContainer(comment.level)}>
                    <div>
                      <img src={comment.img} alt="" />
                    </div>
                    <div css={s.commentDetail}>
                      <div css={s.detailHeader}>
                        <span>{comment.username}</span>
                        {/* toLocaleString() -> 날짜와 시간 형태로 가져옴, 백엔드에서 LocaldataTime으로 자료형 잡으면 가능*/}
                        <span>{new Date(comment.createDate).toLocaleString()}</span> 
                      </div>
                      <pre css={s.detailContent}>{comment.content}</pre>
                      <div css={s.detailButtons}>
                        {
                          userInfoData?.data?.userId === comment.writerId &&
                          <div>
                            { // 수정상태에 담겨있는 commentId랑 내가 누른 댓글의 아이디랑 같으면 취소버튼 
                              commentModfiyData.commentId === comment.id  
                              ?
                              <button onClick={handleModfiyCommentCancelButtonOnClick}>취소</button>
                              : // 수정할때 원래 text도 가져올거라서 comment.content도 매개변수로 받아옴
                              <button onClick={() => handleModfiyCommentButtonOnClick(comment.id, comment.content)}>수정</button>
                            } 
                            <button onClick={() => handleDeleteCommentButtonOnClick(comment.id)}>삭제</button>
                          </div>
                        }
                        { // 부모 - 댓글 - 댓글 까지만 가능하게
                          comment.level < 3 &&
                          <div>
                            <button onClick={() => handleReplyButtonOnClick(comment.id)}>답글</button>
                          </div>
                        }
                      </div>
                    </div>
                  </div>
                  { // 답글 input 창 
                    commentData.parentId === comment.id &&
                    <div css={s.commentWriteBox(comment.level)}>
                      <textarea name="content" onChange={handleCommentInputOnChange} 
                        value={commentData.content} placeholder='답글을 입력하세요.' autoFocus>
                      </textarea>
                      <button onClick={handleCommentSubmitOnClick}>작성하기</button>
                    </div>
                  }
                  { // 수정 input 창 
                    commentModfiyData.commentId === comment.id &&
                    <div css={s.commentWriteBox(comment.level)}>
                      <textarea name="content" onChange={handleCommentModfiyInputOnChange} 
                        value={commentModfiyData.content} placeholder='수정할 내용을 입력하세요.' autoFocus>
                      </textarea>
                      <button onClick={handleCommentModfiySubmitOnClick}>수정하기</button>
                    </div>
                  }
                  

                </div>
                )
              }
            </div>
          </div>
        </>
      }
    </div>
  )
}

export default DetailPage;