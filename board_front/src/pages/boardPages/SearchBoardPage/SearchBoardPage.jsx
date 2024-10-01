import React, { useState } from 'react'
/** @jsxImportSource @emotion/react */
import * as s from './style';
import { IoMdArrowDropleft, IoMdArrowDropright } from "react-icons/io";
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { useQuery } from 'react-query';
import { instance } from '../../../apis/util/instance';
import { IoLogoReddit } from "react-icons/io5";

function SearchboardPage(props) {
  // localhost:3000/board/number/9?page=9
  // 물음표를 기준으로 오른쪽이 searchParams - page=9 , 왼쪽이 useParams - 9
  // 쓰는 기준 -> 만약 페이지번호라든지 board번호는 보통은 그냥 useParams를 많이 씀 
  // 이때 변수가 여러개인거, 예시로 page라는 값이랑 limit라는 값이 있다 option느낌이 있다 하면 searchParams 사용 

  const [ searchParams, setSearchParams ] = useSearchParams(); // 주소의 params를 가져올때 사용, 주소:포토/페이지URL?key=value(쿼리스트링, 파라미터)
  const [ totalPageCount, setTotalPageCount ] = useState(1);   // 페이지의 카운트 수 
  const navigate = useNavigate();
  const limit = 10;                                            // 해당 게시판의 한페이지당 몇개의 페이지를 보여줄것인가에 대해 보여줌

  // 처음 렌더링 될때는 search와 option이 없어서 문자열 null 값으로 들어가짐
  // 만약 null 값이라면  search는 빈값으로, option은 all로 잡아줌
  const [ searchValue, setSearchValue ] = useState(searchParams.get("search") ?? ""); 
  const [ searchOption, setSearchOption ] = useState(searchParams.get("option") ?? "all");

  // 선택된 숫자의 페이지의 boardList 가져옴 
  const boardList = useQuery(
    // 페이지 번호, 검색 옵션, 검색어가 변할 때마다 다시 요청 날라감
    ["boardListQuery", searchParams.get("page"), searchParams.get("option"), searchParams.get("search")], 
    async () => 
      await instance.get
    (`/board/search?page=${searchParams.get("page")}&limit=${limit}&search=${searchValue}&option=${searchOption}`),
    {
      retry: 0,
      refetchOnWindowFocus: false,
      onSuccess: response => {
        // 전체 페이지 수를 계산하여 상태 업데이트
        setTotalPageCount(
          response.data.totalCount % limit === 0  
          // 나눠떨어지면, totalCount가 100개이면 limit이 10개로 고정되어있으니 총 10개의 페이지를 보여줌 
          ? response.data.totalCount / limit
          : Math.floor(response.data.totalCount / limit) + 1);  
          // 예시) 나눠떨어지지않고, 10.3으로 나오면 소수점을 없애고 +1 해서 11개의 페이지를 보여줌
          
      }
    }
  )

  // 검색 옵션(전체, 제목, 작성자별 등)
  const handleSearchOptionOnChange = (e) => {
    setSearchOption(e.target.value);
  }
  

  // 검색 내용
  const handleSearchInputOnChagne = (e) => {
    setSearchValue(e.target.value);
  }

  
  // 검색 버튼 클릭 시
  const handleSearchButtonOnClick = () => {
    navigate(`/board/search?page=1&option=${searchOption}&search=${searchValue}`);
  }

  // input에서 enter키 누르면 요청 날라가게 함 
  const handleSearchButtonOnKeyDown = (e) => {
    if(e.keyCode === 13) {
      navigate(`/board/search?page=1&option=${searchOption}&search=${searchValue}`);
    }
  }
  
  // 페이지 이동
  const handlePageOnChange = (e) => {
    navigate(
      // react-paginate 라이브러리에서 페이지 인덱스는 0부터 시작하기 때문에 1번페이지 누르면 0번으로 인식되기 때문에 +1 해줘야 함 
      `/board/search?page=${e.selected + 1}&option=${searchOption}&search=${searchValue}`
    ); 
  }

  return (
    <div>
      <Link to={"/"}><h1><IoLogoReddit/></h1></Link>
      <div>
        <select onChange={handleSearchOptionOnChange} value={searchOption}>
          <option value="all">전체</option>
          <option value="title">제목</option>
          <option value="writer">작성자</option>
        </select>
        <input type="search" onChange={handleSearchInputOnChagne} value={searchValue} onKeyDown={handleSearchButtonOnKeyDown}/>
        <button onClick={handleSearchButtonOnClick} >검색</button>
      </div>
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
            boardList.data?.data?.boards?.map(board => 
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

export default SearchboardPage;