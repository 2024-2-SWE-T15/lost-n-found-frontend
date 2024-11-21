import React, { useState, useEffect } from "react";
import { Spacer } from "./Spacer";

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
      // Fetch stronghold markers
      const strongholdData = await fetchStrongholdMarkers();
      console.log("Returned Data from API:", strongholdData);
  
      if (!strongholdData || !strongholdData.id) {
        console.error("Invalid stronghold data received:", strongholdData);
        return;
      }
  
      const stronghold_id = strongholdData.id;
  
      // Convert kept_coordinates to an array if necessary
      const formattedKeptCoordinates = Array.isArray(kept_coordinates)
        ? kept_coordinates
        : [kept_coordinates.lat, kept_coordinates.lng];
  
      // Create the updated request body
      const updatedRequestBody = {
        ...requestBody,
        stronghold_id: stronghold_id,
        kept_coordinates: formattedKeptCoordinates, // Ensure it is an array
      };
  
      console.log("Updated request body with kept_coordinates -> ", updatedRequestBody);
  
      // POST /post/found 요청
      const foundUrl = `${URL}/post/found`;
  
      const response = await fetch(foundUrl, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedRequestBody),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log("POST /post/found response:", data);
        alert("등록이 완료되었습니다."); // 성공 알림
      } else {
        console.error("Failed to POST /post/found:", response.statusText);
        alert("등록을 실패하였습니다."); // 실패 알림
      }
    } catch (error) {
      console.error("Error during handleRegisterClick:", error);
      alert("오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

// API 호출 메서드
const fetchStrongholdMarkers = async () => {
    const formattedKeptCoordinates = Array.isArray(kept_coordinates)
      ? kept_coordinates
      : [kept_coordinates.lat, kept_coordinates.lng];
  
    const [lat, lng] = formattedKeptCoordinates;
  
    const url = `${URL}/marker/stronghold`;
    const payload = new URLSearchParams({
        name: requestBody.title,
        description: requestBody.description,
        lat: lat,
        lng: lng,
      });
  
    console.log("POST Payload:", payload);
  
    try {
      const response = await fetch(url, {
        method: "POST", // POST 요청
        credentials: "include",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: payload.toString(),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched stronghold markers:", data);
        return data; // API 응답 데이터 반환
      } else {
        console.error("Failed to fetch markers:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching markers:", error);
    }
  
    return null; // 에러 발생 시 null 반환
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
