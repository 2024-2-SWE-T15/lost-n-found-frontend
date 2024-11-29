import { CenteredColumn, Column, Row } from "./Flex";
import styled, { css } from "styled-components";
import { useEffect, useMemo, useRef } from "react";

import { GoTag } from "react-icons/go";
import { IoMdTime } from "react-icons/io";
import { MdNavigateNext } from "react-icons/md";
import { SIDEBAR_CONTENT_WIDTH_PX } from "./Sidebar";
import { Spacer } from "./Spacer";
import { useNavigate } from "react-router-dom";

const THUMBNAIL_SIZE = 80;
const THUMBNAIL_INFO_LIST_GAP = 12;
const NEXT_ICON_SIZE = 24;
const INFO_LIST_WIDTH =
  SIDEBAR_CONTENT_WIDTH_PX -
  THUMBNAIL_SIZE -
  THUMBNAIL_INFO_LIST_GAP -
  NEXT_ICON_SIZE;

const MarkerDetails = ({
  markerData,
  onHoverChanged = undefined,
  isActive = false,
}) => {
  const navigate = useNavigate();
  const ref = useRef();

  const formattedCreateTime = useMemo(() => {
    return new Date(markerData.createTime).toLocaleString("ko-KR");
  }, [markerData.createTime]);

  const formattedHashtags = useMemo(() => {
    if (!markerData.hashtags || markerData.hashtags.length === 0) {
      return "없음";
    }

    return markerData.hashtags.map((tag) => `#${tag}`).join(" ");
  }, [markerData.hashtags]);

  useEffect(() => {
    const { current: element } = ref;
    if (isActive && element) {
      // @ts-ignore
      element.scrollIntoView({
        block: "nearest",
        inline: "nearest",
        behavior: "smooth",
      });
    }
  }, [isActive]);

  return (
    <Container
      ref={ref}
      // @ts-ignore
      $isActive={isActive}
      onMouseEnter={() => onHoverChanged?.(true)}
      onMouseLeave={() => onHoverChanged?.(false)}
      onClick={() => navigate(`/post/${markerData.id}`)}
    >
      {markerData.thumbnail ? (
        <Thumbnail src={markerData.thumbnail} />
      ) : (
        <NoThumbnail>이미지 없음</NoThumbnail>
      )}
      <Spacer size={THUMBNAIL_INFO_LIST_GAP} />
      <InfoList>
        <Title
          // @ts-ignore
          $isActive={isActive}
        >
          {markerData.title}
        </Title>
        <ExtraInfo>
          <CreatedTimeIcon />
          <ExtraInfoText>{formattedCreateTime}</ExtraInfoText>
        </ExtraInfo>
        <ExtraInfo>
          <TagIcon />
          <ExtraInfoText>{formattedHashtags}</ExtraInfoText>
        </ExtraInfo>
      </InfoList>
      <MdNavigateNext size={NEXT_ICON_SIZE} />
    </Container>
  );
};

const Container = styled(Row)`
  width: 100%;
  height: 100px;
  align-items: center;
  padding: 9px 0 9px 8px; // 10px - 1px (border)
  border-bottom: 1px solid #eee;

  user-select: none;
  cursor: pointer;

  ${(props) =>
    // @ts-ignore
    props.$isActive && "background-color: #fff7f7;"}
`;

const Thumbnail = styled.img`
  width: ${THUMBNAIL_SIZE}px;
  height: ${THUMBNAIL_SIZE}px;
  border-radius: 4px;
  object-fit: cover;
`;

const NoThumbnail = styled(CenteredColumn)`
  width: ${THUMBNAIL_SIZE}px;
  height: ${THUMBNAIL_SIZE}px;
  border-radius: 4px;
  background-color: #f0f0f0;
  font-size: 12px;
  color: #999;
`;

const InfoList = styled(Column)`
  width: ${INFO_LIST_WIDTH}px;
  flex: 1 1 0;
  align-items: stretch;
  gap: 4px;
`;

const Title = styled.div`
  width: 100%;
  height: 40px;
  font-size: 16px;
  line-height: 20px;
  font-weight: bold;

  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;

  ${(props) =>
    // @ts-ignore
    props.$isActive && "color: firebrick;"}
`;

const ExtraInfo = styled(Row)`
  align-items: center;
  gap: 4px;
  font-size: 12px;
  line-height: 16px;
  color: #999;
`;

const ExtraInfoIconStyle = css`
  flex: 0 0 auto;
  width: 14px;
  height: 14px;
  min-width: 14px;
  min-height: 14px;
`;

const CreatedTimeIcon = styled(IoMdTime)`
  ${ExtraInfoIconStyle}
`;

const TagIcon = styled(GoTag)`
  ${ExtraInfoIconStyle}
`;

const ExtraInfoText = styled.div`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
`;

export default MarkerDetails;
