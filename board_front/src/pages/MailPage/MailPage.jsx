import React, { useState } from 'react'
/** @jsxImportSource @emotion/react */
import * as s from './style';
import { Link } from 'react-router-dom';
import { useMutation } from 'react-query';
import { instance } from '../../apis/util/instance';
import { RingLoader } from 'react-spinners';

function MailPage() {

  const [ mailData, setMailData ] = useState({
    toEmail: "",
    subject: "",
    content: ""
  });

  const sendMail = useMutation(
    async () => {
      return await instance.post(`/email`, mailData);
    },
    {
      onSuccess: response => {
        alert("메일이 전송되었습니다");
        window.location.reload();
      },
      onError: error => {
        alert("메일 전송 중 오류가 발생하였습니다.");
      }
    }
  )

  const handleMailInputOnchange = (e) => {
    setMailData(mailData => ({
      ...mailData,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmitOnClick = () => {
    sendMail.mutateAsync();
  }
  
  
  return (
    <div css={s.layout}>
    {
      sendMail.isLoading 
      ?
      <div css={s.loadingLayout}>
        <RingLoader/>
      </div> 
      : 
      <></>
    }
      <Link to={"/"}><h1>메인페이지</h1></Link>
      <input type="text" name='toEmail' placeholder='받는 사람' onChange={handleMailInputOnchange} value={mailData.toEmail}/>
      <input type="text" name='subject' placeholder='제목' onChange={handleMailInputOnchange} value={mailData.subject}/>
      <textarea name="content" placeholder='내용' onChange={handleMailInputOnchange} value={mailData.content}></textarea>
      <button onClick={handleSubmitOnClick}>전송</button>
    </div>
  );
}

export default MailPage;