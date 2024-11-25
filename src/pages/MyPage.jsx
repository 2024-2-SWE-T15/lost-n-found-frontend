import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";

function UserInfo() {
  const [userInfo, setUserInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nickname: "",
    email: "",
    profile_image_base64: "", // Base64 문자열
  });

  // 사용자 정보 가져오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(
          "https://caring-sadly-marmoset.ngrok-free.app/auth/userinfo",
          {
            headers: {
              Accept: "application/json",
            },
            withCredentials: true,
          }
        );
        setUserInfo(response.data);
        setFormData({
          nickname: response.data.nickname || "",
          email: response.data.email || "",
          profile_image_base64: response.data.profile_image_url || "",
        });
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, []);

  // 입력 필드 변경 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 이미지 파일 업로드 핸들러
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profile_image_base64: reader.result }); // Base64 문자열 저장
      };
      reader.readAsDataURL(file);
    }
  };

  // 수정된 정보 저장
  const handleSave = async () => {
    try {
      const requestBody = {
        nickname: formData.nickname,
        email: formData.email,
        profile_image_url: formData.profile_image_base64, // Base64 문자열로 전송
      };
  
      console.log("Request Body to be sent to API:", requestBody); // 데이터 형식 출력
  
      const response = await axios.put(
        "https://caring-sadly-marmoset.ngrok-free.app/auth/",
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
  
      console.log("Response from API:", response.data); // 응답 출력
      alert("정보가 성공적으로 수정되었습니다."); // 성공 알림
      setUserInfo(response.data);
      setIsEditing(false); // 수정 모드 종료
    } catch (error) {
      console.error("Error updating user info:", error.response || error.message);
  
      // 에러 응답 데이터 확인
      if (error.response) {
        console.error("Response Status:", error.response.status);
        console.error("Response Data:", error.response.data);
      }
  
      alert("정보 수정에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 편집 모드 전환
  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  if (!userInfo) {
    return <Loading>Loading...</Loading>;
  }

  return (
    <Container>
      <Header>사용자 정보</Header>
      <ProfileImageContainer>
        <ProfileImage
          src={formData.profile_image_base64 || "/default-profile.png"}
          alt="Profile"
        />
        {isEditing && (
          <ImageUploadLabel htmlFor="imageUpload">이미지 변경</ImageUploadLabel>
        )}
        <ImageUploadInput
          id="imageUpload"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
        />
      </ProfileImageContainer>
      <InfoRow>
        <Label>닉네임:</Label>
        {isEditing ? (
          <Input
            type="text"
            name="nickname"
            value={formData.nickname}
            onChange={handleInputChange}
          />
        ) : (
          <Value>{userInfo.nickname || "없음"}</Value>
        )}
      </InfoRow>
      <InfoRow>
        <Label>이메일:</Label>
        {isEditing ? (
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
        ) : (
          <Value>{userInfo.email || "없음"}</Value>
        )}
      </InfoRow>
      <InfoRow>
        <Label>계정 생성 시간:</Label>
        <Value>{new Date(userInfo.create_time).toLocaleString()}</Value>
      </InfoRow>
      <InfoRow>
        <Label>최근 업데이트 시간:</Label>
        <Value>{new Date(userInfo.update_time).toLocaleString()}</Value>
      </InfoRow>
      <ButtonRow>
        {isEditing ? (
          <>
            <Button onClick={handleSave}>저장하기</Button>
            <Button onClick={toggleEdit}>취소</Button>
          </>
        ) : (
          <Button onClick={toggleEdit}>수정하기</Button>
        )}
      </ButtonRow>
    </Container>
  );
}

export default UserInfo;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  max-width: 600px;
  margin: 0 auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Header = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const ProfileImageContainer = styled.div`
  position: relative;
  margin-bottom: 30px; /* 이미지와 닉네임 사이 간격 추가 */
`;

const ProfileImage = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin-bottom: 20px;
  object-fit: cover;
`;

const ImageUploadLabel = styled.label`
  position: absolute;
  bottom: -10px;
  right: 0;
  background-color: #4caf50;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
`;

const ImageUploadInput = styled.input`
  display: none;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 400px;
  margin-bottom: 20px; /* 각 정보 섹션 간 간격 추가 */
`;

const Label = styled.span`
  font-weight: bold;
  color: #555;
`;

const Value = styled.span`
  color: #333;
`;

const Input = styled.input`
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 70%;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  background-color: #4caf50;
  color: white;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;

const Loading = styled.div`
  text-align: center;
  font-size: 18px;
  margin-top: 50px;
  color: #555;
`;

