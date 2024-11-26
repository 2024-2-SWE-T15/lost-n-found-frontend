import React, { useState } from "react";
import styled from "styled-components";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState(""); // 검색어
  const [hashtags, setHashtags] = useState([]); // 해시태그 목록
  const [newHashtag, setNewHashtag] = useState(""); // 추가할 해시태그 입력
  const [isDistanceActive, setIsDistanceActive] = useState(true); // 거리 활성화 상태
  const [distance, setDistance] = useState(100); // 거리 값
  const [isFilterVisible, setIsFilterVisible] = useState(false); // 토글 상태

  // 검색 핸들러
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = () => {
    console.log("검색어:", searchTerm);
  };

  // 해시태그 추가 핸들러
  const handleHashtagChange = (e) => {
    setNewHashtag(e.target.value);
  };

  const handleHashtagKeyPress = (e) => {
    if (e.key === "Enter" && newHashtag.trim()) {
      setHashtags((prev) => {
        const updatedHashtags = [...prev, newHashtag.trim()];
        console.log("해시태그 배열:", updatedHashtags);
        return updatedHashtags;
      });
      setNewHashtag("");
    }
  };

  // 해시태그 삭제 핸들러
  const removeHashtag = (index) => {
    setHashtags((prev) => {
      const updatedHashtags = prev.filter((_, i) => i !== index);
      console.log("해시태그 배열:", updatedHashtags);
      return updatedHashtags;
    });
  };

  // 거리 활성화 토글 핸들러
  const toggleDistance = () => {
    setIsDistanceActive(!isDistanceActive);
    console.log("거리 활성화 상태:", !isDistanceActive);
  };

  // 거리 슬라이더 핸들러
  const handleDistanceChange = (e) => {
    setDistance(e.target.value);
    console.log("거리 값:", e.target.value);
  };

  // 필터 토글 핸들러
  const toggleFilterVisibility = () => {
    setIsFilterVisible(!isFilterVisible);
    console.log("필터 토글 상태:", !isFilterVisible ? "열림" : "닫힘");
  };

  return (
    <Wrapper>
      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="검색어를 입력하세요"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <SearchButton onClick={handleSearchSubmit}>검색</SearchButton>
        <FilterIconButton onClick={toggleFilterVisibility}>
          ⚙️
        </FilterIconButton>
      </SearchContainer>

      {/* 해시태그 영역 */}
      {isFilterVisible && (
        <HashtagContainer>
          <HashtagInput
            type="text"
            placeholder="해시태그 입력 후 Enter"
            value={newHashtag}
            onChange={handleHashtagChange}
            onKeyPress={handleHashtagKeyPress}
          />
          <HashtagList>
            {hashtags.map((tag, index) => (
              <Hashtag key={index}>
                #{tag}
                <RemoveButton onClick={() => removeHashtag(index)}>x</RemoveButton>
              </Hashtag>
            ))}
          </HashtagList>
        </HashtagContainer>
      )}

      {/* 거리 조정 영역 */}
      <DistanceContainer>
        <DistanceToggleButton
          isActive={isDistanceActive}
          onClick={toggleDistance}
        >
          {isDistanceActive ? "거리 활성화 ✔" : "거리 비활성화 ✘"}
        </DistanceToggleButton>
        <Slider
          type="range"
          min="100"
          max="1000"
          step="100"
          value={distance}
          onChange={handleDistanceChange}
          disabled={!isDistanceActive}
        />
        <DistanceValue>
          {isDistanceActive ? `거리: ${distance}m` : "거리 조정 비활성화됨"}
        </DistanceValue>
      </DistanceContainer>
    </Wrapper>
  );
};

export default SearchBar;

// Styled Components
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 8px;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const SearchButton = styled.button`
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;

const FilterIconButton = styled.button`
  padding: 10px;
  background-color: #eee;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #ddd;
  }
`;

const HashtagContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const HashtagInput = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
`;

const HashtagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const Hashtag = styled.span`
  background-color: #f0f0f0;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: red;
  font-size: 14px;
  cursor: pointer;
`;

const DistanceContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const DistanceToggleButton = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== "isActive", // isActive prop을 DOM으로 전달하지 않음
})`
  padding: 10px;
  background-color: ${(props) => (props.isActive ? "#4caf50" : "#ccc")};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: ${(props) => (props.isActive ? "#45a049" : "#bbb")};
  }
`;

const Slider = styled.input`
  width: 100%;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
`;

const DistanceValue = styled.span`
  font-size: 14px;
  color: ${(props) => (props.disabled ? "#ccc" : "#333")};
`;
