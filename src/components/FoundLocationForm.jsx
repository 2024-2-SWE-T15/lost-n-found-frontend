import React, { useState, useEffect } from "react";
import { Spacer } from "./Spacer";
import { createStrongholdMarker, registerFoundItem } from "../api";

function FoundLocationForm({ requestBody, goBack, setCoordinates, initialCoordinates }) {
  const [kept_coordinates, setKeptCoordinates] = useState(initialCoordinates || [37.5665, 126.9780]); // 초기 값 설정
  const URL = 'https://caring-sadly-marmoset.ngrok-free.app';

  useEffect(() => {
    if (initialCoordinates) {
      setKeptCoordinates(initialCoordinates);
    }
  }, [initialCoordinates]);

  const handleRegisterClick = async () => {
    try {
      // 강력 마커 생성
      const [lat, lng] = Array.isArray(kept_coordinates)
        ? kept_coordinates
        : [kept_coordinates.lat, kept_coordinates.lng];
      const strongholdPayload = new URLSearchParams({
        name: requestBody.title,
        description: requestBody.description,
        lat: lat,
        lng: lng,
      }).toString();

      const strongholdData = await createStrongholdMarker(strongholdPayload);
      console.log("Returned Data from API:", strongholdData);

      if (!strongholdData || !strongholdData.id) {
        console.error("Invalid stronghold data received:", strongholdData);
        return;
      }

      const stronghold_id = strongholdData.id;

      // 물건 등록 요청 본문 생성
      const formattedKeptCoordinates = Array.isArray(kept_coordinates)
        ? kept_coordinates
        : [kept_coordinates.lat, kept_coordinates.lng];
      const updatedRequestBody = {
        ...requestBody,
        stronghold_id: stronghold_id,
        kept_coordinates: formattedKeptCoordinates, // Ensure it is an array
      };

      console.log("Updated request body with kept_coordinates -> ", updatedRequestBody);

      // 물건 등록 API 호출
      const responseData = await registerFoundItem(updatedRequestBody);
      alert("등록이 완료되었습니다."); // 성공 알림
      console.log("Response from /post/found:", responseData);
    } catch (error) {
      console.error("Error during handleRegisterClick:", error);
      alert("오류가 발생했습니다. 다시 시도해주세요.");
    }
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
