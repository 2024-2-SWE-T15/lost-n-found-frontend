import { IoMdCheckmark, IoMdSearch } from "react-icons/io";
import { MdFilterAlt, MdFilterAltOff } from "react-icons/md";
import styled, { css } from "styled-components";

import { useState } from "react";

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
        <SearchButton onClick={handleSearchSubmit}>
          <SearchIcon />
        </SearchButton>
        <FilterIconButton onClick={toggleFilterVisibility}>
          {isFilterVisible ? <FilterEnabledIcon /> : <FilterDisabledIcon />}
        </FilterIconButton>
      </SearchContainer>

      {/* 해시태그 영역 */}
      {isFilterVisible && (
        <>
          <HashtagContainer>
            <HashtagInput
              type="text"
              placeholder="해시태그 입력 후 Enter"
              value={newHashtag}
              onChange={handleHashtagChange}
              onKeyPress={handleHashtagKeyPress}
            />
            {hashtags.length > 0 && (
              <HashtagList>
                {hashtags.map((tag, index) => (
                  <Hashtag key={index}>
                    #{tag}
                    <RemoveButton onClick={() => removeHashtag(index)}>
                      x
                    </RemoveButton>
                  </Hashtag>
                ))}
              </HashtagList>
            )}
          </HashtagContainer>

          {/* 거리 조정 영역 */}
          <DistanceContainer>
            <DistanceLabel>거리 기반 검색</DistanceLabel>
            <DistanceToggleButton
              // @ts-ignore
              $isActive={isDistanceActive}
              onClick={toggleDistance}
            >
              {isDistanceActive && <DistanceButtonEnabledIcon />}
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
            <DistanceValue
              // @ts-ignore
              $disabled={!isDistanceActive}
            >{`${distance}m`}</DistanceValue>
          </DistanceContainer>
        </>
      )}
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
  padding: 8px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 8px;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: stretch;
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
  padding: 0 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;

const SearchIcon = styled(IoMdSearch)`
  width: 16px;
  height: 16px;
  min-width: 16px;
  min-height: 16px;
  transform: translateY(2px);
`;

const FilterIconButton = styled.button`
  padding: 0 10px;
  background-color: #eee;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #ddd;
  }
`;

const FilterIconStyle = css`
  width: 14px;
  height: 14px;
  min-width: 14px;
  min-height: 14px;
  transform: translateY(2px);
`;

const FilterEnabledIcon = styled(MdFilterAlt)`
  ${FilterIconStyle}
  color: #333;
`;

const FilterDisabledIcon = styled(MdFilterAltOff)`
  ${FilterIconStyle}
  color: #888;
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
  flex-direction: row;
  align-items: center;
  gap: 10px;
  padding: 0 4px;
`;

const DistanceLabel = styled.div`
  flex: 0 0 auto;
  font-size: 14px;
`;

const DistanceToggleButton = styled.button`
  flex: 0 0 auto;

  width: 24px;
  height: 24px;
  padding: 4px 6px;
  background-color: ${(props) =>
    // @ts-ignore
    props.$isActive ? "#4caf50" : "white"};
  color: white;
  border: ${(props) =>
    // @ts-ignore
    props.$isActive ? "none" : "1px solid #bbb"};
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: ${(props) =>
      // @ts-ignore
      props.$isActive ? "#45a049" : "#eee"};
  }
`;

const DistanceButtonEnabledIcon = styled(IoMdCheckmark)`
  width: 12px;
  height: 12px;
  min-width: 12px;
  min-height: 12px;
  transform: translateY(2px);
`;

const Slider = styled.input`
  width: 100%;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
`;

const DistanceValue = styled.span`
  font-size: 14px;
  color: ${(props) =>
    // @ts-ignore
    props.$disabled ? "#ccc" : "#333"};
`;
