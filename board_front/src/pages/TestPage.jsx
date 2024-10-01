import React, { useState } from 'react';

function TestPage() {
  
    // 메뉴 목록을 상태로 관리
    const menus = ['Best Menu', 'Coffee', 'ColdBrew', 'Latte', '스무디', 'Tea', '디저트', '에이드'];
    const [currentMenuIndex, setCurrentMenuIndex] = useState(0); // 현재 메뉴 인덱스를 상태로 관리

    // 왼쪽 화살표 클릭 시 (최소 0부터 시작)
    const handlePrev = () => {
      if (currentMenuIndex > 0) {
        setCurrentMenuIndex(currentMenuIndex - 1);
      }
    };

    // 오른쪽 화살표 클릭 시 (최대 menus.length - 4까지만 이동)
    const handleNext = () => {
      if (currentMenuIndex < menus.length - 4) {
        setCurrentMenuIndex(currentMenuIndex + 1);
      }
    };

    return (
      <div className="kiosk-container" style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column' }}>
        
        {/* 상단 헤더 */}
        <div className="header" style={{ backgroundColor: '#004225', padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="home-icon">
            {/* 홈 아이콘 */}
          </div>
          <div className="logo">
            {/* 로고 */}
            <img src="/starbucks-logo.png" alt="Starbucks Logo" />
          </div>
          <div className="favorite-icon">
            {/* 즐겨찾기 아이콘 */}
          </div>
        </div>

        {/* 메뉴 카테고리 */}
        <div className="menu-category" style={{ backgroundColor: '#004225', padding: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <button onClick={handlePrev} style={{ marginRight: '10px' }}>{'<'}</button>
          <div className="menu-buttons" style={{ display: 'flex', gap: '10px' }}>
            {/* currentMenuIndex부터 4개의 메뉴만 보여줍니다 */}
            {menus.slice(currentMenuIndex, currentMenuIndex + 4).map((menu, index) => (
              <button key={index} className="menu-button">{menu}</button>
            ))}
          </div>
          <button onClick={handleNext} style={{ marginLeft: '10px' }}>{'>'}</button>
        </div>

        {/* 상품 목록 */}
        <div className="product-list" style={{ flex: '1', padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridGap: '10px' }}>
          <div className="product-item">상품1</div>
          <div className="product-item">상품2</div>
          <div className="product-item">상품3</div>
          <div className="product-item">상품4</div>
          <div className="product-item">상품5</div>
          <div className="product-item">상품6</div>
          <div className="product-item">상품7</div>
          <div className="product-item">상품8</div>
        </div>

        {/* 하단 주문 목록 및 결제 버튼 */}
        <div className="order-summary" style={{ backgroundColor: '#004225', padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="order-list" style={{ flex: '1', marginRight: '10px' }}>
            <h4>Order</h4>
            <p>총 수량: 0개</p>
            <p>총 금액: 0원</p>
          </div>
          <div className="order-buttons" style={{ display: 'flex', flexDirection: 'column' }}>
            <button>전체 삭제</button>
            <button>결제 하기</button>
          </div>
        </div>

      </div>
    );
  };

export default TestPage;