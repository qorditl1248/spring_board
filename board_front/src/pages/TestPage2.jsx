import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function TestPage2() {
  const [ seconds, setSeconds ] = useState(10); // 10초 카운트다운 초기화
  const navigate = useNavigate();

  useEffect(() => {
    // 1초마다 timeLeft 값을 줄이는 setInterval 설정
    const timerInterval = setInterval(() => {
      setSeconds(seconds => seconds - 1);
    }, 1000);

    // 10초 후에 메인 페이지로 리다이렉트
    const timeout = setTimeout(() => {
      navigate('/');
    }, 10000);

    // 컴포넌트가 언마운트되면 타이머를 클리어
    return () => {
      clearInterval(timerInterval);
      clearTimeout(timeout);
    };
  }, [navigate]);

  return (
    <div className="payment-complete" style={{ padding: '20px' }}>
      <div style={{ backgroundColor: '#e0f4e0', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
        <h2>주문이 완료되었습니다.</h2>
        <p>상품이 준비 중입니다. 잠시만 기다려 주세요.</p>
        <h4>현재 스탬프 개수: 6개</h4>
      </div>

      <p style={{ marginTop: '20px', textAlign: 'center' }}>
        {seconds}초 남음
      </p>
    </div>
  );
}

export default TestPage2;