import { CenteredColumn, Column } from "./Flex";
import styled, { css } from "styled-components";

import { Spacer } from "./Spacer";
import { useMemo } from "react";

const RecommendedPostSlot = ({ postData, priorHashtags }) => {
  const { id, title, thumbnail, hashtags } = postData;

  const formattedHashtags = useMemo(() => {
    if (!hashtags || hashtags.length === 0) {
      return "없음";
    }

    let tags = hashtags;

    if (Array.isArray(priorHashtags) && priorHashtags.length > 0) {
      const common = priorHashtags.filter((tag) => hashtags.includes(tag));
      const uncommon = hashtags.filter((tag) => !common.includes(tag));

      tags = [...common, ...uncommon];
    }

    return tags.map((tag) => `#${tag}`).join(" ");
  }, [hashtags, priorHashtags]);

  return (
    <Container href={`/post/${id}`}>
      {thumbnail ? (
        <Thumbnail src={thumbnail} />
      ) : (
        <NoThumbnail>이미지 없음</NoThumbnail>
      )}
      <Spacer size={8} />
      <Title>{title}</Title>
      <Hashtags>{formattedHashtags}</Hashtags>
    </Container>
  );
};

const Container = styled.a`
  ${Column}
  width: 100%;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
`;

const ThumnailAreaStyle = css`
  flex: 0 0 auto;
  aspect-ratio: 1 / 1;
  border-radius: 8px;
`;

const Thumbnail = styled.img`
  ${ThumnailAreaStyle}
  object-fit: cover;
`;

const NoThumbnail = styled(CenteredColumn)`
  ${ThumnailAreaStyle}
  background-color: #f0f0f0;
  font-size: 12px;
  color: #999;
`;

const SingleLineStyle = css`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: bold;
  ${SingleLineStyle}
`;

const Hashtags = styled.div`
  font-size: 12px;
  color: #999;
  ${SingleLineStyle}
`;

export default RecommendedPostSlot;
