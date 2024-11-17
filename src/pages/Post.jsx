import React, { useEffect } from "react";
import { CenteredColumn } from "../components/Flex";
import { Spacer } from "../components/Spacer";
import styled from "styled-components";
import { useParams } from "react-router-dom";

function Post() {
  return (
    <Container>
      <Header>
        <MenuIcon>☰</MenuIcon>
        <Title>LostAndFound</Title>
        <ProfileIcon>👤</ProfileIcon>
      </Header>

      <Content>
        <DetailContainer>
          <CloseButton>✖</CloseButton>
          <SectionTitle>물품 상세 정보</SectionTitle>

          <MainContent>
            <ImageInfoContainer>
              <ImagePlaceholder />
              <InfoButtons>
                <InfoButton>정보</InfoButton>
                <InfoButton>정보</InfoButton>
              </InfoButtons>
            </ImageInfoContainer>

            {/* New Flex Container for Third Info and Map */}
            <InfoMapContainer>
              <DescriptionBox>정보</DescriptionBox>
              <MapContainer>
                <KakaoMap />
              </MapContainer>
            </InfoMapContainer>
          </MainContent>
        </DetailContainer>

        <RelatedItems>
          <RelatedTitle>연관 물품 목록</RelatedTitle>
          <ItemsContainer>
            <RelatedItem />
            <RelatedItem />
            <RelatedItem />
            <RelatedItem />
          </ItemsContainer>
        </RelatedItems>
      </Content>
    </Container>
  );
}

const KakaoMap = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=8e612bee3d25ae70ca8f4c0ab521877e&autoload=false`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById("map");
        const options = {
          center: new window.kakao.maps.LatLng(
            37.2939505631116,
            126.97498529609302
          ),
          level: 3,
        };

        const map = new window.kakao.maps.Map(container, options);

        const markerPosition = new window.kakao.maps.LatLng(
          37.2939505631116,
          126.97498529609302
        );
        const marker = new window.kakao.maps.Marker({
          position: markerPosition,
        });
        marker.setMap(map);
      });
    };

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div
      id="map"
      style={{
        width: "100%",
        height: "150px",
        borderRadius: "4px",
        backgroundColor: "#ddd",
      }}
    />
  );
};

// Styled components (no changes needed here except the added styles below)

const Container = styled.div`
  width: 100%;
  height: 100vh;
  background-color: #f0f0f0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Header = styled.div`
  width: 100%;
  height: 60px;
  background-color: #333;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  font-size: 24px;
`;

const MenuIcon = styled.div``;

const Title = styled.div`
  font-size: 18px;
  font-weight: bold;
`;

const ProfileIcon = styled.div``;

const Content = styled.div`
  width: 90%;
  max-width: 600px;
  background-color: white;
  margin-top: 20px;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const DetailContainer = styled.div`
  position: relative;
  width: 100%;
  text-align: center;
  margin-bottom: 20px;
`;

const CloseButton = styled.div`
  position: absolute;
  top: -20px;
  left: -20px;
  font-size: 24px;
  cursor: pointer;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const ImageInfoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-bottom: 20px;
`;

const ImagePlaceholder = styled.div`
  width: 80px;
  height: 80px;
  background-color: #ddd;
  border-radius: 4px;
  margin-right: 20px;
`;

const InfoButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const InfoButton = styled.button`
  width: 100%;
  max-width: 150px;
  padding: 10px;
  background-color: #f5f5f5;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
`;

const InfoMapContainer = styled.div`
  display: flex;
  align-items: flex-start;
  width: 100%;
  margin-top: 10px;
`;

const DescriptionBox = styled.div`
  width: 30%;
  min-width: 100px;
  height: 150px;
  background-color: #f5f5f5;
  margin-right: 10px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #666;
`;

const MapContainer = styled.div`
  width: 70%;
  height: 150px;
  background-color: #ddd;
  border-radius: 4px;
`;

const RelatedItems = styled.div`
  width: 100%;
  margin-top: 20px;
`;

const RelatedTitle = styled.h3`
  font-size: 16px;
  margin-bottom: 10px;
  font-weight: bold;
`;

const ItemsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
`;

const RelatedItem = styled.div`
  width: 50px;
  height: 50px;
  background-color: #ddd;
  border-radius: 4px;
`;

export default Post;
