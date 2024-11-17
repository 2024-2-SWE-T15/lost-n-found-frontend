import React, { useState } from "react";

function LostForm({ coordinates }) {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [category, setCategory] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [base64DataArray, setBase64DataArray] = useState([]);

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const newSelectedImages = [...selectedImages];
    const newBase64DataArray = [...base64DataArray];

    files.forEach((file) => {
      newSelectedImages.push(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        newBase64DataArray.push(reader.result);
        setBase64DataArray(newBase64DataArray);
        console.log("Base64 Encoded Image:", reader.result);
      };
      reader.readAsDataURL(file);
    });

    setSelectedImages(newSelectedImages);
  };

  const handleFormSubmit = () => {
    const categoryArray = category.split(" ");

    const requestBody = {
      title: title,
      coordinates: coordinates,
      hashtags: categoryArray,
      description: details,
      photos: base64DataArray,
      personal_idlist: {
        phone: phoneNumber,
        birth: birthDate,
      },
    };

    console.log("Request Body:", requestBody);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        maxWidth: "300px",
        margin: "0 auto",
      }}
    >
      <input
        type="text"
        placeholder="제목"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={inputStyle}
      />
      <input
        type="text"
        placeholder="상세"
        value={details}
        onChange={(e) => setDetails(e.target.value)}
        style={inputStyle}
      />
      <input
        type="text"
        placeholder="카테고리"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        style={inputStyle}
      />
      {/* 추가된 전화번호 입력 필드 */}
      <input
        type="tel"
        placeholder="전화번호 (선택사항)"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        style={inputStyle}
      />
      {/* 추가된 생년월일 입력 필드 */}
      <input
        type="date"
        placeholder="생년월일 (선택사항)"
        value={birthDate}
        onChange={(e) => setBirthDate(e.target.value)}
        style={inputStyle}
      />
      {base64DataArray.map((base64, index) => (
        <img
          key={index}
          src={base64}
          alt={`Uploaded Preview ${index}`}
          style={{ width: "100%", height: "auto", marginBottom: "10px" }}
        />
      ))}
      <label
        htmlFor="imageUpload"
        style={{
          ...buttonStyle,
          display: "inline-block",
          textAlign: "center",
          cursor: "pointer",
        }}
      >
        이미지 업로드
      </label>
      <input
        type="file"
        id="imageUpload"
        style={{ display: "none" }}
        accept="image/*"
        multiple
        onChange={handleImageUpload}
      />
      <button style={buttonStyle} onClick={handleFormSubmit}>
        등록하기
      </button>
    </div>
  );
}

const inputStyle = {
  padding: "10px",
  border: "1px solid #ccc",
  borderRadius: "4px",
  width: "100%",
};

const buttonStyle = {
  padding: "10px",
  border: "none",
  borderRadius: "4px",
  backgroundColor: "#4CAF50",
  color: "white",
  cursor: "pointer",
};

export default LostForm;
