import React, { useState, useEffect } from "react";
import { Spacer } from "./Spacer";

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
      <button style={backButtonStyle} onClick={goBack}>
        &#8592; 뒤로
      </button>
      <div style={headerStyle}>
        <h1 style={titleStyle}>물건을 보관할 장소를 지정해주세요</h1>
      </div>
      <div style={contentContainerStyle}>
        <button style={buttonStyle} onClick={handleRegisterClick}>
          등록하기
        </button>
      </div>
    </div>
  );
}

const containerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "space-between",
  height: "100vh", // Full screen height
  padding: "20px",
  position: "relative", // Needed for placing the back button absolutely
};

const headerStyle = {
  position: "absolute",
  top: "20px", // Space from the top
  textAlign: "center",
  width: "100%",
};

const contentContainerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  flex: "1", // Push content to the middle of the page
};

const titleStyle = {
  fontSize: "20px",
  fontWeight: "bold",
  margin: "40px",
};

const buttonStyle = {
    padding: "15px 20px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#4CAF50",
    color: "white",
    cursor: "pointer",
    width: "1000%",
    textAlign: "center",
    maxWidth: "300px",
    marginTop: "20px",
  };
  
const backButtonStyle = {
  position: "absolute",
  top: "10px",
  left: "10px",
  padding: "5px 10px",
  border: "none",
  borderRadius: "4px",
  backgroundColor: "transparent",
  color: "#333",
  fontSize: "16px",
  cursor: "pointer",
};

export default FoundLocationForm;
