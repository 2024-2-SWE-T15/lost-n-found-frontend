import { CenteredColumn, Column } from "./Flex";
import { selectFilter, selectMap } from "../selector";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import MarkerDetails from "./MarkerDetails";
import { setActiveMarkerId } from "../actions";
import styled from "styled-components";

const SearchResult = () => {
  const dispatch = useDispatch();
  const [hoveredMarkerId, setHoveredMarkerId] = useState(null);
  const { activeMarkerId } = useSelector(selectMap);
  const {
    // @ts-ignore
    isSearching = false,
    result = [],
  } = useSelector(selectFilter) ?? {};

  useEffect(() => {
    if (!hoveredMarkerId) return;

    const timeout = setTimeout(() => {
      dispatch(setActiveMarkerId(hoveredMarkerId));
    }, 300);

    return () => clearTimeout(timeout);
  }, [dispatch, hoveredMarkerId]);

  if (isSearching) {
    return (
      <Content>
        <Indicator>검색 중...</Indicator>;
      </Content>
    );
  }

  if (!Array.isArray(result)) {
    return (
      <Content>
        <Indicator>검색 도중 오류가 발생했습니다.</Indicator>;
      </Content>
    );
  }

  if (result.length === 0) {
    return (
      <Content>
        <Indicator>검색 결과가 없습니다.</Indicator>;
      </Content>
    );
  }

  return (
    <Column>
      {result.map((item) => (
        <MarkerDetails
          key={item.id}
          markerData={item}
          onHoverChanged={(hovered) =>
            setHoveredMarkerId(hovered ? item.id : null)
          }
          isActive={item.id === activeMarkerId}
        />
      ))}
    </Column>
  );
};

const Content = styled(CenteredColumn)`
  flex: 1 0 auto;
`;

const Indicator = styled(CenteredColumn)`
  height: 100%;
  font-size: 24px;
  color: #666;
  text-align: center;
`;

export default SearchResult;
