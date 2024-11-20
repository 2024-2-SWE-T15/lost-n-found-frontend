import React, { useState, useEffect } from "react";

function FoundLocationForm({ requestBody, goBack, setCoordinates, initialCoordinates }) {
  const [keptCoordinates, setKeptCoordinates] = useState(initialCoordinates || [37.5665, 126.9780]); // 초기 값 설정
  console.log("request body -> ", requestBody);

  useEffect(() => {
    if (initialCoordinates) {
      setKeptCoordinates(initialCoordinates);
    }
  }, [initialCoordinates]);

  const handleRegisterClick = () => {
    // 새로운 requestBody에 keptCoordinates를 추가합니다.
    const updatedRequestBody = {
      ...requestBody,
      keptCoordinates, // 새로운 변수 추가
    };
    console.log("Updated request body with keptCoordinates -> ", updatedRequestBody);
  };

  return (
    <div style={containerStyle}>
      <h1>물건을 보관할 장소를 지정해주세요</h1>
      <button style={buttonStyle} onClick={handleRegisterClick}>등록하기</button>
      <button style={backButtonStyle} onClick={goBack}>뒤로 가기</button>
    </div>
  );
}

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  gap: '10px',
};

const buttonStyle = {
  padding: "10px",
  border: "none",
  borderRadius: "4px",
  backgroundColor: "#4CAF50",
  color: "white",
  cursor: "pointer",
};

const backButtonStyle = {
  padding: "10px",
  border: "none",
  borderRadius: "4px",
  backgroundColor: "#FF5C5C",
  color: "white",
  cursor: "pointer",
  marginTop: "10px",
};

export default FoundLocationForm;
