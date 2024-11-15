import React from "react";

function FoundForm() {
  return (
    <div>
      <h1>발견한 물건의 정보를 입력해주세요</h1>
      <input type="text" placeholder="제목" />
      <input type="text" placeholder="상세" />
      <input type="text" placeholder="카테고리" />
      <button>이미지 업로드</button>
      <button>위치 지정하기</button>
    </div>
  );
}

export default FoundForm;
