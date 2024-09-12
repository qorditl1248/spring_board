import React, { useState } from 'react'
/** @jsxImportSource @emotion/react */
import * as s from './style';
import { IoMdArrowDropleft, IoMdArrowDropright } from "react-icons/io";
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { useQuery } from 'react-query';
import { instance } from '../../../apis/util/instance';

function NumberBoardListPage(props) {
  
  const [ searchParams, setSearchParams ] = useSearchParams();
  const [ totalPageCount, setTotalPageCount ] = useState(1);
  const navigate = useNavigate();
  const limit = 10;

  const boardList = useQuery(
    ["boardListQuery", searchParams.get("page")],
    async () => 
      await instance.get(`/board/list?page=${searchParams.get("page")}&limit=${limit}`),
    {
      retry: 0,
      onSuccess: response => {
        setTotalPageCount(
          response.data.totalCount % limit === 0  // 나눠떨어지면 그냥 나누면 되고 아니면 + 1
          ? (response.data.totalCount / limit + 1) 
          : limit + 1);
      }
    }
  )

  const handlePageOnChange = (e) => {
    navigate(`/board/number?page=${e.selected + 1}`)
  }

  return (
    <div>
      <Link to={"/"}><h1>사이트 로고</h1></Link>
      <table>
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>작성자</th>
            <th>추천</th>
            <th>조회</th>
          </tr>
        </thead>
        <tbody>
          {
            boardList.isLoading 
            ?
            <></>
            :
            boardList.data.data.boards.map(board => 
              <tr key={board.id} onClick={() => navigate(`/board/detail/${board.id}`)}>
                  <td>{board.id}</td>
                  <td>{board.title}</td>
                  <td>{board.writerName}</td>
                  <td>{board.likeCount}</td>
                  <td>{board.viewCount}</td>
              </tr>
            )
          }
        </tbody>
      </table>
      <div css={s.paginateContainer}>
        <ReactPaginate 
          breakLabel="..."
          previousLabel={<><IoMdArrowDropleft/></>}
          nextLabel={<><IoMdArrowDropright/></>}
          pageCount={totalPageCount - 1}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          activeClassName= 'active'
          onPageChange={handlePageOnChange}
          forcePage={parseInt(searchParams.get("page")) - 1}
        />
      </div>
    </div>
  )
}

export default NumberBoardListPage;