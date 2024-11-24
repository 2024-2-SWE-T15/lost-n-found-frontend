import React, { useState } from "react";
import styled from "styled-components";

function FoundForm({ setFoundFormData, coordinates }) {
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [category, setCategory] = useState('');
  const [phoneNumber, setPhoneNumber] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [base64DataArray, setBase64DataArray] = useState([]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newSelectedImages = [...selectedImages];
    const newBase64DataArray = [...base64DataArray];

    files.forEach((file) => {
      newSelectedImages.push(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        newBase64DataArray.push(reader.result);
        setBase64DataArray([...newBase64DataArray]);
      };
      reader.readAsDataURL(file);
    });

    setSelectedImages([...newSelectedImages]);
  };

  const handleFormSubmit = () => {
    const categoryArray = category.split(" ");
    const requestBody = {
      title: title,
      coordinates: coordinates || [null, null], // Add coordinates to requestBody
      hashtags: categoryArray,
      description: details,
      photos: base64DataArray,
      personal_idlist: {
        phone: phoneNumber,
        birth: birthDate,
      },
    };

    // Pass data to Main component to switch to FoundLocationForm
    setFoundFormData(requestBody);
  };

  return (
    <Container>
      <Title>발견한 물건의 정보를 입력해주세요</Title>
      <Input
        type="text"
        placeholder="제목"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Input
        type="text"
        placeholder="상세"
        value={details}
        onChange={(e) => setDetails(e.target.value)}
      />
      <Input
        type="text"
        placeholder="카테고리"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <Input
        type="tel"
        placeholder="전화번호 (선택사항)"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
      <Input
        type="date"
        placeholder="생년월일 (선택사항)"
        value={birthDate}
        onChange={(e) => setBirthDate(e.target.value)}
      />
      <HiddenFileInput
        type="file"
        id="imageUpload"
        accept="image/*"
        multiple
        onChange={handleImageUpload}
      />
      {base64DataArray.map((base64, index) => (
        <ImagePreview
          key={index}
          src={base64}
          alt={`Uploaded Preview ${index}`}
        />
      ))}
      <ImageUploadLabel htmlFor="imageUpload">이미지 업로드</ImageUploadLabel>
      <SubmitButton onClick={handleFormSubmit}>등록하기</SubmitButton>
    </Container>
  );
}

export default FoundForm;

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  gap: 10px;
`;

const Title = styled.h1`
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: bold;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
`;

const ImageUploadLabel = styled.label`
  display: inline-block;
  padding: 10px;
  background-color: #d4f4d4;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  width: 100%;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const ImagePreview = styled.img`
  width: 200px;
  height: 200px;
  margin-bottom: 10px;
`;

const SubmitButton = styled.button`
  padding: 10px;
  border: none;
  border-radius: 4px;
  background-color: #4caf50;
  color: white;
  cursor: pointer;
  width: 100%;
`;