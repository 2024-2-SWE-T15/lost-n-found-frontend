import { CenteredColumn, CenteredRow, Column, Row } from "./Flex";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import styled, { css } from "styled-components";
import { useEffect, useMemo, useState } from "react";

// @ts-ignore
import BlueMarkerSrc from "../assets/marker_img/marker_blue.png";
import { CgProfile } from "react-icons/cg";
import { FaMapMarkerAlt } from "react-icons/fa";
import { GoTag } from "react-icons/go";
import { IoMdTime } from "react-icons/io";
import RecommendedPostSlot from "./RecommendedPostSlot";
// @ts-ignore
import RedMarkerSrc from "../assets/marker_img/marker_red.png";
import { Spacer } from "./Spacer";
import { fetchPostRecommendations } from "../api";
import { useKakaoLoader } from "../hooks/useKakaoLoader";

const ADDRESS_CANNOT_BE_DETERMINED =
  "주소를 찾을 수 없습니다. 우측 지도에서 위치를 확인해주세요.";
const SAME_ADDRESS = "습득 장소와 동일합니다.";

const getFormattedAddress = ({ lat, lng }) => {
  const geocoder = new window.kakao.maps.services.Geocoder();
  return new Promise((resolve, reject) => {
    // note: the order of lat and lng is reversed, as the API expects it
    geocoder.coord2Address(lng, lat, (result, status) => {
      const lines = [];

      if (status === window.kakao.maps.services.Status.OK) {
        const { road_address: roadAddress, address: jibunAddress } = result[0];

        if (roadAddress) {
          lines.push(`도로명주소: ${roadAddress.address_name}`);
        }

        if (jibunAddress) {
          lines.push(`지번주소: ${jibunAddress.address_name}`);
        }
      }

      if (lines.length === 0) {
        reject();
      } else {
        resolve(lines.join("\n"));
      }
    });
  });
};

const COORD_EPSILON = 0.0001;
const isSameCoordinates = (coord1, coord2) => {
  return (
    Math.abs(coord1.lat - coord2.lat) < COORD_EPSILON &&
    Math.abs(coord1.lng - coord2.lng) < COORD_EPSILON
  );
};

const PostDetails = ({ postData }) => {
  const isSdkLoaded = useKakaoLoader();
  const [coordAddress, setCoordAddress] = useState(null);
  const [keptCoordAddress, setKeptCoordAddress] = useState(null);
  const [recommendation, setRecommendation] = useState(null);

  const formattedCreateTime = useMemo(() => {
    return new Date(postData.createTime).toLocaleString("ko-KR");
  }, [postData.createTime]);

  const formattedHashtags = useMemo(() => {
    if (!postData.hashtags || postData.hashtags.length === 0) {
      return "없음";
    } else {
      return postData.hashtags.map((tag) => `#${tag}`).join(" ");
    }
  }, [postData.hashtags]);

  useEffect(() => {
    if (!isSdkLoaded) return;

    // prevent double fetch on strict mode
    const timeout = setTimeout(() => {
      getFormattedAddress(postData.coordinates)
        .then(setCoordAddress)
        .catch(() => setCoordAddress(ADDRESS_CANNOT_BE_DETERMINED));
    }, 0);

    return () => clearTimeout(timeout);
  }, [isSdkLoaded, postData.coordinates]);

  useEffect(() => {
    if (!isSdkLoaded) return;
    if (!postData.keptCoordinates) return;

    if (isSameCoordinates(postData.coordinates, postData.keptCoordinates)) {
      setKeptCoordAddress(SAME_ADDRESS);
      return;
    }

    // prevent double fetch on strict mode
    const timeout = setTimeout(() => {
      getFormattedAddress(postData.coordinates)
        .then(setKeptCoordAddress)
        .catch(() => setCoordAddress(ADDRESS_CANNOT_BE_DETERMINED));
    }, 0);

    return () => clearTimeout(timeout);
  }, [isSdkLoaded, postData.keptCoordinates, postData.coordinates]);

  useEffect(() => {
    // prevent double fetch on strict mode
    const timeout = setTimeout(() => {
      fetchPostRecommendations(postData.id).then(setRecommendation);
    }, 0);

    return () => clearTimeout(timeout);
  }, [postData.id]);

  const isBlueMarkerPresent =
    postData.keptCoordinates &&
    !isSameCoordinates(postData.coordinates, postData.keptCoordinates);

  const center = isBlueMarkerPresent
    ? {
        lat: (postData.coordinates.lat + postData.keptCoordinates.lat) / 2,
        lng: (postData.coordinates.lng + postData.keptCoordinates.lng) / 2,
      }
    : postData.coordinates;

  return (
    <Container>
      <Title>{postData.isLost ? "분실물" : "습득물"} 상세 정보</Title>
      <Spacer size={20} />
      <InfoSection>
        {postData.photos?.[0] ? (
          <Thumbnail src={postData.photos[0]} />
        ) : (
          <NoThumbnail>이미지 없음</NoThumbnail>
        )}
        <InfoList>
          <ItemTitle>{postData.title}</ItemTitle>
          <ExtraInfo>
            <ProfileIcon />
            <ExtraInfoText>{postData.nickname}</ExtraInfoText>
          </ExtraInfo>
          <ExtraInfo>
            <CreatedTimeIcon />
            <ExtraInfoText>{formattedCreateTime}</ExtraInfoText>
          </ExtraInfo>
          <ExtraInfo>
            <TagIcon />
            <ExtraInfoText>{formattedHashtags}</ExtraInfoText>
          </ExtraInfo>
        </InfoList>
      </InfoSection>
      <Spacer size={20} />
      <ItemDescription>{postData.description}</ItemDescription>
      <LocationSection>
        <Addresses>
          {postData.isLost ? (
            <Address
              category="분실 장소"
              iconColor="red"
              details={coordAddress ?? "주소를 불러오는 중..."}
            />
          ) : (
            <>
              <Address
                category="발견 장소"
                iconColor="red"
                details={coordAddress ?? "주소를 불러오는 중..."}
              />
              <Address
                category="보관 장소"
                iconColor="blue"
                details={keptCoordAddress ?? "주소를 불러오는 중..."}
              />
            </>
          )}
        </Addresses>
        <MapWrapper>
          {isSdkLoaded && (
            <Map
              center={center}
              level={3}
              style={{
                width: "100%",
                height: "100%",
              }}
            >
              <MapMarker
                position={postData.coordinates}
                image={{
                  src: RedMarkerSrc,
                  size: { width: 32, height: 32 },
                }}
              />
              {isBlueMarkerPresent && (
                <MapMarker
                  position={postData.keptCoordinates}
                  image={{
                    src: BlueMarkerSrc,
                    size: { width: 32, height: 32 },
                  }}
                />
              )}
            </Map>
          )}
        </MapWrapper>
      </LocationSection>
      {recommendation && (
        <>
          <RecommendationSection
            title={
              postData.isLost
                ? "혹시 이 중에 있나요?"
                : "이 분이 찾는건 아닐까요?"
            }
            posts={postData.isLost ? recommendation.found : recommendation.lost}
            priorHashtags={postData.hashtags}
          />
          <RecommendationSection
            title="비슷한 게시물"
            posts={postData.isLost ? recommendation.lost : recommendation.found}
            priorHashtags={postData.hashtags}
          />
        </>
      )}
    </Container>
  );
};

const RecommendationSection = ({ title, posts, priorHashtags }) => {
  if (posts.length === 0) {
    return null;
  }

  return (
    <>
      <RecommendationSectionHeader>{title}</RecommendationSectionHeader>
      <RecommendedPostList>
        {posts.map((post) => (
          <RecommendedPostSlotWrapper key={post.id}>
            <RecommendedPostSlot
              postData={post}
              priorHashtags={priorHashtags}
            />
          </RecommendedPostSlotWrapper>
        ))}
      </RecommendedPostList>
    </>
  );
};

const Address = ({ category, iconColor, details }) => {
  return (
    <CenteredRow>
      <MarkerIcon color={iconColor} />
      <Spacer size={4} />
      <AddressCategory>{category}</AddressCategory>
      <Spacer size={12} />
      <AddressDetails
        // @ts-ignore
        $isError={details === ADDRESS_CANNOT_BE_DETERMINED}
      >
        {details}
      </AddressDetails>
    </CenteredRow>
  );
};

const Container = styled(Column)`
  max-width: 600px;
  align-items: stretch;
  padding: 20px 0;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  text-align: center;
`;

const InfoSection = styled(Row)`
  gap: 20px;
  align-items: flex-start;
  justify-items: stretch;
`;

const ThumnailAreaStyle = css`
  flex: 0 0 auto;
  width: 160px;
  height: 160px;
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

const InfoList = styled(Column)`
  flex: 1 1 auto;
  align-items: stretch;
  gap: 4px;
`;

const ItemTitle = styled.div`
  font-size: 28px;
  font-weight: bold;

  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;

  &:hover {
    -webkit-line-clamp: unset;
  }
`;

const ExtraInfo = styled(Row)`
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

const ProfileIcon = styled(CgProfile)`
  ${ExtraInfoIconStyle}
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

  &:hover {
    -webkit-line-clamp: unset;
  }
`;

const ItemDescription = styled.p`
  font-size: 14px;
  color: #333;

  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 5;
  overflow: hidden;

  &:hover {
    -webkit-line-clamp: unset;
  }
`;

const LocationSection = styled(Row)`
  display: flex;
  gap: 20px;
  white-space: pre-wrap;
  font-size: 14px;
  align-items: center;
`;

const Addresses = styled(Column)`
  flex: 1 1 auto;
  gap: 8px;
`;

const AddressCategory = styled.span`
  font-weight: bold;
  flex: 0 0 auto;
`;

const AddressDetails = styled.span`
  font-size: 12px;
  ${({
    // @ts-ignore
    $isError,
  }) => $isError && "color: red;"}
`;

const MarkerIcon = styled(FaMapMarkerAlt)`
  flex: 0 0 auto;
  width: 16px;
  height: 16px;
  min-width: 16px;
  min-height: 16px;
`;

const MapWrapper = styled(CenteredColumn)`
  width: 240px;
  height: 240px;
  clip-path: inset(50px);

  &:hover {
    clip-path: inset(0);
  }

  transition: clip-path 0.3s;
`;

const RecommendationSectionHeader = styled.h1`
  font-size: 28px;
  font-weight: bold;
  padding-left: 8px;
  padding-bottom: 8px;
`;

const RecommendedPostList = styled(Row)`
  width: 100%;
`;

const RecommendedPostSlotWrapper = styled(Column)`
  width: 25%;
  padding: 0 8px;
`;

export default PostDetails;
