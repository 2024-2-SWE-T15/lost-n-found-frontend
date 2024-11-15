import React from "react";

function LostForm() {
  return (
    <div>
      <h1>제목</h1>
      <input type="text" placeholder="제목" />
      <h1>상세</h1>
      <input type="text" placeholder="상세" />
      <h1>카테고리</h1>
      <input type="text" placeholder="카테고리" />
      <button>이미지 업로드</button>
      <button>등록하기</button>
    </div>
  );
}

export default LostForm;
