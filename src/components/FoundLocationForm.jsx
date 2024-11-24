import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { createStrongholdMarker, registerFoundItem } from "../api";

function FoundLocationForm({ requestBody, goBack, setCoordinates, initialCoordinates }) {
  const [kept_coordinates, setKeptCoordinates] = useState(initialCoordinates || [37.5665, 126.9780]); // 초기 값 설정

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
    <Container>
      <BackButton onClick={goBack}>
        &#8592; 뒤로
      </BackButton>
      <Header>
        <Title>물건을 보관할 장소를 지정해주세요</Title>
      </Header>
      <Content>
        <RegisterButton onClick={handleRegisterClick}>
          등록하기
        </RegisterButton>
      </Content>
    </Container>
  );
}

export default FoundLocationForm;

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 100vh;
  padding: 20px;
  position: relative;
`;

const Header = styled.div`
  position: absolute;
  top: 20px;
  text-align: center;
  width: 100%;
`;

const Title = styled.h1`
  font-size: 20px;
  font-weight: bold;
  margin: 40px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
`;

const RegisterButton = styled.button`
  padding: 15px 20px;
  border: none;
  border-radius: 6px;
  background-color: #4caf50;
  color: white;
  cursor: pointer;
  width: 100%;
  max-width: 300px;
  text-align: center;
  margin-top: 20px;
`;

const BackButton = styled.button`
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  background-color: transparent;
  color: #333;
  font-size: 16px;
  cursor: pointer;
`;