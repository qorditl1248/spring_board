import React, { useState } from 'react'
import { testApi } from '../apis/testApi';

function TestPage() {

  const [ inputValue, setInputValue ] = useState({
    content: ""
  });

  const handleInputOnChange = (e) => {
    setInputValue(inputValue => ({
      ...inputValue,
      [e.target.name]: e.target.value
    }))
  }

  const handleInputOnClick = async() => {

    if(inputValue.content.trim() === '') {
      alert("빈값은 입력할 수 없습니다.");
      setInputValue({
        content: ""
      });
      return;
    }

    const testData = await testApi(inputValue);
    console.log(testData);

    if(!testData.isSuccess) {
      console.log(testData.fieldErrors);
      return;
    }
    
    alert("완료!");
    setInputValue({
      content: ""
    });
  }
  
  return (
    <div>
      <input type="text" onChange={handleInputOnChange} value={inputValue.content} name='content'/>
      <button onClick={handleInputOnClick}>확인</button>
    </div>
  )
}

export default TestPage