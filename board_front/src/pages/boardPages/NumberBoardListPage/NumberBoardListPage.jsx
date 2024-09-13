import React, { useState } from 'react'
/** @jsxImportSource @emotion/react */
import * as s from './style';
import { IoMdArrowDropleft, IoMdArrowDropright } from "react-icons/io";
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { useQuery } from 'react-query';
import { instance } from '../../../apis/util/instance';
import { IoLogoReddit } from "react-icons/io5";

function NumberBoardListPage(props) {
  // localhost:3000/board/number/9?page=9
  // 물음표를 기준으로 오른쪽이 searchParams - page=9 , 왼쪽이 useParams - 9
  // 쓰는 기준 -> 만약 페이지번호라든지 board번호는 보통은 그냥 useParams를 많이 씀 
  // 이때 변수가 여러개인거, 예시로 page라는 값이랑 limit라는 값이 있다 option느낌이 있다 하면 searchParams 사용 

  const [ searchParams, setSearchParams ] = useSearchParams(); // 주소의 params를 가져올때 사용, 주소:포토/페이지URL?key=value(쿼리스트링, 파라미터)
  const [ totalPageCount, setTotalPageCount ] = useState(1);   // 페이지의 카운트 수 
  const navigate = useNavigate();
  const limit = 10;                                            // 해당 게시판의 한페이지당 몇개의 페이지를 보여줄것인가에 대해 보여줌

  // 선택된 숫자의 페이지의 boardList 가져옴 
  const boardList = useQuery(
    ["boardListQuery", searchParams.get("page")], // 페이지 번호가 바뀔때마다 렌더링
    async () => 
      await instance.get(`/board/list?page=${searchParams.get("page")}&limit=${limit}`),
    {
      retry: 0,
      onSuccess: response => {
        setTotalPageCount(
          response.data.totalCount % limit === 0  // 나눠떨어지면 그냥 나누고 
          ? response.data.totalCount / limit
          : Math.floor(response.data.totalCount / limit) + 1);  // 나눠떨어지지 않으면 소수점 없애고 + 1 해줌
      }
    }
  )

  const handlePageOnChange = (e) => {
    navigate(`/board/number?page=${e.selected + 1}`); // 선택된 번호에 인덱스를 가져오기때문에 + 1 해줘야지 내가 누른 번호가 됨
  }

  return (
    <div>
      <Link to={"/"}><h1><IoLogoReddit/></h1></Link>
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
          pageCount={totalPageCount}
          marginPagesDisplayed={1}                  // 양쪽 끝에 1개 씩 보이는거
          pageRangeDisplayed={5}                    // 중간에 5개씩 보이는거
          activeClassName= 'active'                 // 라이브러리 안에 className을 active
          onPageChange={handlePageOnChange}         // 번호를 선택했을 때 onChange 일어남 - 인덱스값을 가지고 오는데 그냥 숫자로 쓸거여서 위에서 + 1을 해줌
          forcePage={parseInt(searchParams.get("page")) - 1}  // 파라미터에 들어온 페이지 번호를 선택해줌, 이때 -1은 인덱스 번호를 가져오기때문임
        />
      </div>
    </div>
  )
}

export default NumberBoardListPage;