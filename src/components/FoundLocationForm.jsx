import React, { useState, useEffect } from "react";

function FoundLocationForm({ requestBody, goBack, setCoordinates, initialCoordinates }) {
  const [kept_coordinates, setKeptCoordinates] = useState(initialCoordinates || [37.5665, 126.9780]); // 초기 값 설정

  useEffect(() => {
    if (initialCoordinates) {
      setKeptCoordinates(initialCoordinates);
    }
  }, [initialCoordinates]);

  const handleRegisterClick = () => {
    // 배열로 변환
    const formattedKeptCoordinates = Array.isArray(kept_coordinates)
      ? kept_coordinates
      : [kept_coordinates.lat, kept_coordinates.lng];
  
    // Create updated request body with kept_coordinates as an array
    const updatedRequestBody = {
      ...requestBody,
      kept_coordinates: formattedKeptCoordinates, // Ensure it is an array
    };
    console.log("Updated request body with kept_coordinates -> ", updatedRequestBody);
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
