import React, { useState } from "react";
import { Spacer } from "./Spacer";

function FoundForm({ setFoundFormData, coordinates }) {
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [category, setCategory] = useState('');
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
    };

    // Pass data to Main component to switch to FoundLocationForm
    setFoundFormData(requestBody);
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>발견한 물건의 정보를 입력해주세요</h1>
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
      <input
        type="file"
        id="imageUpload"
        accept="image/*"
        multiple
        onChange={handleImageUpload}
        style={{ display: 'none' }}
      />
      {base64DataArray.map((base64, index) => (
        <img
          key={index}
          src={base64}
          alt={`Uploaded Preview ${index}`}
          style={{ width: '200px', height: '200px', marginBottom: '10px' }}
        />
      ))}
      <label
        htmlFor="imageUpload"
        style={{
          ...imageUploadLabelStyle,
          display: "inline-block",
          textAlign: "center",
          cursor: "pointer",
        }}
      >
        이미지 업로드
      </label>
      <br></br>
      <br></br>
      <button style={buttonStyle} onClick={handleFormSubmit}>
        등록하기
      </button>
    </div>
  );
}


const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  maxWidth: '400px',
  margin: '0 auto',
  padding: '20px',
  gap: '10px',
};

const titleStyle = {
  marginBottom: '20px',
  fontSize: '18px',
  fontWeight: 'bold',
};

const inputStyle = {
  padding: '10px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  width: '100%',
};

const imageUploadLabelStyle = {
  display: 'inline-block',
  padding: '10px',
  backgroundColor: '#d4f4d4',
  borderRadius: '4px',
  cursor: 'pointer',
  textAlign: 'center',
  width: '100%',
};

const buttonStyle = {
  padding: "10px",
  border: "none",
  borderRadius: "4px",
  backgroundColor: "#4CAF50",
  color: "white",
  cursor: "pointer",
  width: "100%",
};

export default FoundForm;
