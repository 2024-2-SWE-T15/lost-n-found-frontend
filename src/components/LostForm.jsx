import React, { useState } from "react";
import { submitLostItem } from "../api";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

function LostForm({ coordinates }) {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [category, setCategory] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [base64DataArray, setBase64DataArray] = useState([]);

  const navigate = useNavigate(); // Hook for redirection

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
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

  const handleFormSubmit = async () => {
    try {
      const response = await submitLostItem({
        title,
        coordinates,
        category,
        description: details,
        base64DataArray,
        phoneNumber,
        birthDate,
      });

      console.log("Response from API:", response);

      // Redirect to /post/:postId after successful submission
      if (response?.id) {
        navigate(`/post/${response.id}`);
      } else {
        console.error("Post ID not found in the response:", response);
        alert("등록에 문제가 발생했습니다.");
      }
    } catch (error) {
      console.error("Error sending request:", error);
      alert("오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <FormContainer>
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
      {base64DataArray.map((base64, index) => (
        <img
          key={index}
          src={base64}
          alt={`Uploaded Preview ${index}`}
          style={{ width: "200px", height: "200px", marginBottom: "10px" }}
        />
      ))}
      <ImageUploadLabel htmlFor="imageUpload">이미지 업로드</ImageUploadLabel>
      <input
        type="file"
        id="imageUpload"
        style={{ display: "none" }}
        accept="image/*"
        multiple
        onChange={handleImageUpload}
      />
      <SubmitButton onClick={handleFormSubmit}>등록하기</SubmitButton>
    </FormContainer>
  );
}

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  max-width: 300px;
  margin: 0 auto;
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

const SubmitButton = styled.button`
  padding: 10px;
  border: none;
  border-radius: 4px;
  background-color: #4caf50;
  color: white;
  cursor: pointer;
  width: 100%;
`;

export default LostForm;