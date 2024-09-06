import React, { useState } from 'react'
/** @jsxImportSource @emotion/react */
import * as s from './style';
import { useQueryClient } from 'react-query';
import { storage } from '../../firebase/firebase';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { v4 as uuid } from 'uuid';
import { Progress } from 'react-sweet-progress';
import "react-sweet-progress/lib/style.css";
import { updateProfileImgApi } from '../../apis/userApi';
import { useNavigate } from 'react-router-dom';


// 프로필 사진, 프로필 사진 클릭해서 사진 변경 가능하게 
function UserProfilePage() {

  const [ uploadPercent, setUploadPercent ] = useState(0);

  const navigate = useNavigate();

  // 프로필을 클릭했을때, user의 정보를 가져오기 위해서 
  const queryClient = useQueryClient();
  const userInfoState = queryClient.getQueryState("userInfoQuery");


  // 이미지 변경 클릭
  const handleImageChangeOnClick = () => {
    if(window.confirm("프로필 사진을 변경하시겠습니까?")) {       // 확인을 누른 경우에만 실행 
      const fileInput = document.createElement("input");  // input 태그 생성
      fileInput.setAttribute("type", "file");             // type="file"
      fileInput.setAttribute("accept", "image/*");        // 사용자가 이미지 파일만 선택 가능하도록 설정
      fileInput.click();                                  // 파일 선택 상자 열림

      fileInput.onchange = (e) => {

        // 선택한 파일을 Array.from()을 사용해 FileList 객체를 "실제 배열"로 변환하여 files 변수에 저장
        const files = Array.from(e.target.files);
        // 파일들 중에 첫번째만 profileImage에 넣음 
        const profileImage = files[0];

        // 업로드 진행률 초기화 
        setUploadPercent(0); 
        
        // ref(storage, path) - Firebase Storage에서 특정 경로를 참조하는 메서드, 
        // storage는 "Firebase Storage의 인스턴스" 
        // path는 저장될 위치  - user/profile 폴더 아래에 저장 
        const storageRef = ref(storage, `user/profile/${uuid()}_${profileImage.name}`);

        // uploadBytesResumable - Firebase Storage 파일에 업로드하는 메소드
        // profileImage(업로드할 파일)를 storageRef(업로드할 저장위치)위치에 저장하겠다 
        const uploadTask = uploadBytesResumable(storageRef, profileImage);
        
        uploadTask.on(
          "state_changed",      // 업로드 상태가 변경될때마다 호출됨  
          (snapshot) => {       // snapshot 업로드 진행상황을 나타내는 객체 
            setUploadPercent(   // 업로드된 바이트 수와 총 바이트 수를 비교하여 업로드 진행률을 계산하고, 이를 상태로 저장 
              Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
          },
          (error) => {          // 업로드 중 오류 발생하면 이 함수 호출
            console.error(error);
          },
          async (success) => {  // 업로드가 완료된 후에 실행
            const url = await getDownloadURL(storageRef); // 업로드가 완료된 파일의 다운로드 URL을 Firebase 스토리지에서 가져옴 
            const response = await updateProfileImgApi(url); // 업데이트하기 위해서 백엔드에 요청보냄(이때 업데이트 할 url 같이 보내줌)
            queryClient.invalidateQueries(["userInfoQuery"]); // 프로필 이미지가 변경됐으니깐 새 데이터 가져옴 
            navigate("/");
        }
      );
    }
  }
}

  // 기본 이미지로 변경 
  const handleDefaultImgChangeOnClick = async () => {
    if(window.confirm("기본이미지로 변경하시겠습니까?")) {
        await updateProfileImgApi("");                     // 업데이트 보낼때 빈 문자열로 보냄 (즉, 기본이미지)
        queryClient.invalidateQueries(["userInfoQuery"]);  // 새 데이터 가져옴 
        navigate("/");
    }
  }

return (
    <div css={s.layout}>
      <h1>프로필</h1>
      <div css={s.imgBox} onClick={handleImageChangeOnClick}>
        <img src={userInfoState?.data?.data.img} alt="" />
      </div>
      <div css={s.progressBox}>
        <Progress percent={uploadPercent} status={uploadPercent !== 100 ? "active" : "success"} />
      </div>
      <div>
        <button onClick={handleDefaultImgChangeOnClick}>기본 이미지로 변경</button>
      </div>
    </div>
  );
}
export default UserProfilePage;