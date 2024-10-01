import React, { useState } from 'react'

function Starbucks2() {


  const [filterType, setFilterType] = useState('monthly'); // 초기 값: 월별 조회
  const [startDate, setStartDate] = useState('2024-09-30');
  const [endDate, setEndDate] = useState('2024-10-30');

  const handleFilterChange = (event) => {
    setFilterType(event.target.value);
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const handleSubmit = () => {
    if (new Date(startDate) > new Date(endDate)) {
      alert("종료일이 시작일 보다 작을 수가 없습니다!");
      return;
    } 
    console.log(`조회 유형: ${filterType}, 시작일: ${startDate}, 종료일: ${endDate}`);
    console.log(`조회 유형: ${filterType}, 시작일: ${new Date(startDate).getMonth() + 1 }, 종료일: ${endDate}`); // 월 
    console.log(`조회 유형: ${filterType}, 시작일: ${new Date(startDate).getFullYear()}, 종료일: ${endDate}`); // 년
    console.log(`조회 유형: ${filterType}, 시작일: ${new Date(startDate).get}, 종료일: ${endDate}`); // 년

    const start = new Date(startDate);
    const end = new Date(endDate);

    const startMonthDay = `${start.getMonth() + 1}.${start.getDate()}`; // 월.일
    const endMonthDay = `${end.getMonth() + 1}.${end.getDate()}`; // 월.일

    console.log(startMonthDay)
    console.log(endMonthDay)
    

    
    // 필요한 추가 작업 수행
  };


  return (
    <div>
      <label>
        <input
          type="radio"
          value="monthly"
          checked={filterType === 'monthly'}
          onChange={handleFilterChange}
        />
        월별
      </label>
      <label>
        <input
          type="radio"
          value="daily"
          checked={filterType === 'daily'}
          onChange={handleFilterChange}
        />
        일별
      </label>

      <input
        type="date"
        value={startDate}
        onChange={handleStartDateChange}
      />
      <input
        type="date"
        value={endDate}
        onChange={handleEndDateChange}
      />

      <button onClick={handleSubmit}>조회</button>
    </div>
  )
}

export default Starbucks2;