import React, { useState } from "react";

function FoundLocationForm({ requestBody, goBack }) { // Accept goBack as a prop
  const [keptCoordinates, setKeptCoordinates] = useState([37.5665, 126.9780]);
  console.log("request body -> ", requestBody);
  
  return (
    <div style={containerStyle}>
      <h1>물건을 보관할 장소를 지정해주세요</h1>
      <button style={buttonStyle}>위치 지정하기</button>
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
  marginTop: "10px", // To add some spacing from the previous button
};

export default FoundLocationForm;
