import React, { useState } from "react";

function LostForm() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [base64Data, setBase64Data] = useState(null); // Base64 데이터 상태 추가

  const handleImageUpload = (event) => {
    const file = event.target.files[0]; // 사용자가 선택한 첫 번째 파일
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file)); // 미리보기 URL 생성

      // Base64 인코딩
      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64Data(reader.result);
        console.log("Base64 Encoded Image:", reader.result); // Base64 데이터를 콘솔에 출력
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px", // 각 요소 사이의 간격 설정
        maxWidth: "300px", // 최대 너비 설정 (선택 사항)
        margin: "0 auto", // 가운데 정렬 (선택 사항)
      }}
    >
      <input type="text" placeholder="제목" style={inputStyle} />
      <input type="text" placeholder="상세" style={inputStyle} />
      <input type="text" placeholder="카테고리" style={inputStyle} />
      {previewUrl && (
        <img
          src={previewUrl}
          alt="Uploaded Preview"
          style={{ width: "100%", height: "auto", marginBottom: "10px" }}
        />
      )}
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
        style={{ display: "none" }} // 숨김 처리된 파일 업로드 input
        accept="image/*"
        onChange={handleImageUpload}
      />
      <button style={buttonStyle}>등록하기</button>
    </div>
  );
}

const inputStyle = {
  padding: "10px",
  border: "1px solid #ccc",
  borderRadius: "4px",
  width: "100%", // 너비 설정
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
