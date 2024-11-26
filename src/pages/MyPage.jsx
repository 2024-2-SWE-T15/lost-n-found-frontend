import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { fetchUserInfo, updateUserInfo } from "../api";

function UserInfo() {
  const [userInfo, setUserInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nickname: "",
    email: "",
    profile_image_base64: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const data = await fetchUserInfo();
        setUserInfo(data);
        setFormData({
          nickname: data.nickname || "",
          email: data.email || "",
          profile_image_base64: data.profile_image_url || "",
        });
      } catch (error) {
        console.error("Failed to load user info:", error);
      }
    };

    loadUserInfo();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profile_image_base64: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    const requestBody = {
      nickname: formData.nickname,
      email: formData.email,
      profile_image_url: formData.profile_image_base64,
    };

    console.log("Request Body:", requestBody);

    try {
      const updatedUserInfo = await updateUserInfo(requestBody);
      setUserInfo(updatedUserInfo);
      setIsEditing(false);
      alert("정보가 성공적으로 수정되었습니다.");
    } catch (error) {
      console.error("Failed to update user info:", error);
      alert("정보 수정에 실패했습니다.");
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (!userInfo) {
    return <Loading>Loading...</Loading>;
  }

  return (
    <Wrapper>
      <BackButton onClick={handleGoBack}>&#8592; 뒤로 가기</BackButton>
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
            <StyledInput
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
            <StyledInput
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
              <PrimaryButton onClick={handleSave}>저장하기</PrimaryButton>
              <SecondaryButton onClick={toggleEdit}>취소</SecondaryButton>
            </>
          ) : (
            <PrimaryButton onClick={toggleEdit}>수정하기</PrimaryButton>
          )}
        </ButtonRow>
      </Container>
    </Wrapper>
  );
}

// Common Styled Components
const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  max-width: 600px;
  margin: 50px auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Header = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const BackButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  background-color: transparent;
  border: none;
  color: black;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const ProfileImageContainer = styled.div`
  position: relative;
  margin-bottom: 30px;
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
  margin-bottom: 20px;
`;

const Label = styled.span`
  font-weight: bold;
  color: #555;
`;

const Value = styled.span`
  color: #333;
`;

const StyledInput = styled.input`
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

const PrimaryButton = styled.button`
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

const SecondaryButton = styled(PrimaryButton)`
  background-color: #ccc;

  &:hover {
    background-color: #bbb;
  }
`;

const Loading = styled.div`
  text-align: center;
  font-size: 18px;
  margin-top: 50px;
  color: #555;
`;

export default UserInfo;
