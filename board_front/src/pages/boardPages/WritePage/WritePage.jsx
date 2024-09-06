import React, { useCallback, useMemo, useRef, useState } from 'react'
/** @jsxImportSource @emotion/react */
import * as s from './style';
import ReactQuill, { Quill } from 'react-quill';
import "react-quill/dist/quill.snow.css";
import ImageResize  from 'quill-image-resize';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../../../firebase/firebase';
import { v4 as uuid} from 'uuid';
import { RingLoader } from 'react-spinners';
import { boardApi } from '../../../apis/boardApi';

 // 해당 모듈 라이브러리를 추가하겠다 (imageResize 라이브러리 추가)
Quill.register("modules/imageResize", ImageResize);


// 글쓰기 페이지
function WritePage() {
  
  // 글 작성 내용 
  const [ board, setBoard ] = useState({
    title: "",
    content: ""
  });

  // 업로드 상태 
  const [ isUploading, setUploading ] = useState(false);
  
  const quillRef = useRef(null);


  // 작성하기 버튼 
  const handleWriteSubmitOnClick = async() => {
    const boardData = await boardApi(board);
    
    if(!boardData.isSuccess) {
      alert(boardData.fieldErrors);
      return;
    }
    alert("작성 완료!");
    setBoard({
      title: "",
      content: ""
    });
  }


  // 제목 글 쓰기
  const handleTitleInputOnChange = (e) => {
    setBoard(board => ({
      ...board,
      [e.target.name]: e.target.value
    }))
  }

  // 입력을 할때마다 실행, 빈값을 계속 넣으면 빈값만 계속들어감 
  const handleQuillValueOnChange = (value) => {
    // console.log(value); - <p>이런식으로 들어옴</p>
    setBoard(board => ({
      ...board,
      content: quillRef.current.getEditor().getText().trim() === "" ? "" : value
    }))
  }

  // useCallback() -> 렌더링 될때 다시 재정의 하지 않는 거 
  // 100번 주소로 만들어서 저장해뒀는데 useCallback이 아니면 렌더링할때 재정의가 되어서 200번 주소가 됨 
  // 그래서 100번 주소에서 못가져오기 때문에 useCallback 사용해서 한번만 정의하기
  const handleImageLoad = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.click();

    // 파일이 변경되었을때 동작 
    input.onchange = () => {
      // getEditor는 editor 객체를 가지고 올 수 있게 라이브러리에 있는 함수 
      const editor = quillRef.current.getEditor();
      const files = Array.from(input.files);
      const imgFile = files[0];
      
      const editPoint = editor.getSelection(true); // 현재 에디터에서 선택된 위치 정보를 가져옴

      const storageRef = ref(storage, `/board/img/${uuid()}_${imgFile.name}`);

      const task =  uploadBytesResumable(storageRef, imgFile);

      setUploading(true);

      task.on(
        "state_changed",
        () => {},
        () => {},
        async() => {
          const url = await getDownloadURL(storageRef); // Firebase에 업로드된 이미지의 다운로드 URL을 가져옴.
          editor.insertEmbed(editPoint.index, "image" ,url); // 선택된 위치에 이미지를 url로 insert 
          editor.setSelection(editPoint.index + 1); // 삽입한 다음 위치로 커서 이동 
          editor.insertText(editPoint.index + 1, "\n"); // 처음에 설정한 위치에 있기 때문에 
          setUploading(false);
        }
      );
    }
  }, []);

  // 리턴해주는 값을 저장하고 있을 거, 상태가 변하든 한번만 
  const toolbarOptions = useMemo(() =>[
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'font': [] }],
    ['bold', 'italic', 'underline', 'strike'],        
    [{ 'color': [] }, { 'background': [] }, { 'align': [] }],         
    [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
    [{ 'indent': '-1'}, { 'indent': '+1' }],          
    ['link', 'image', 'video', 'formula'],
    ['blockquote', 'code-block'],                                        
  ], []);

  return (
    <div css={s.layout}>
      <header css={s.header}>
        <h1>Quill Edit</h1>
        <button onClick={handleWriteSubmitOnClick}>작성하기</button>
      </header>
        <input css={s.titleInput} type='text' 
          onChange={handleTitleInputOnChange} value={board.title} placeholder='게시글의 제목을 입력하세요'
          name='title'
        />
        
      <div css={s.editerLayout}>
        {
          isUploading &&
          <div css={s.loadingLayout}>
            <RingLoader/>
          </div> 
        }
        <ReactQuill 
          ref={quillRef}
          style={{
            boxSizing: "border-box",
            width: "100%",
            height: "100%"
          }}
          onChange={handleQuillValueOnChange}
          value={board.content}
          modules={{
            toolbar: {
              container: toolbarOptions,
              handlers: {
                image: handleImageLoad,
              },
            },
            imageResize: {
              parchment: Quill.import('parchment')
            }
          }}
        />
      </div>
    </div>
  )
}

export default WritePage;