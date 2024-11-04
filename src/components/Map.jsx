import { Map, MapMarker, useMap } from "react-kakao-maps-sdk";
import { useState } from "react";
import { useKakaoLoader } from "../hooks/useKakaoLoader";
import styled from "styled-components";

export default function KakaoMap() {
  const isLoaded = useKakaoLoader();
  const [isVisibleId, setIsVisibleId] = useState(-1);

  const data = [
    {
      id: 0,
      content: <div style={{ color: "#000" }}>학술정보관</div>,
      latlng: { lat: 37.293976, lng: 126.975059 },
    },
    {
      id: 1,
      content: <div style={{ color: "#000" }}>2공학관</div>,
      latlng: { lat: 37.295131, lng: 126.976891 },
    },
    {
      id: 3,
      content: <div style={{ color: "#000" }}>1공학관</div>,
      latlng: { lat: 37.293971, lng: 126.976659 },
    },
    {
      id: 4,
      content: <div style={{ color: "#000" }}>약학관</div>,
      latlng: { lat: 37.292081, lng: 126.976643 },
    },
    {
      id: 5,
      content: <div style={{ color: "#000" }}>정문</div>,
      latlng: { lat: 37.290753, lng: 126.974101 },
    },
    {
      id: 6,
      content: <div style={{ color: "#000" }}>후문</div>,
      latlng: { lat: 37.296352, lng: 126.970610 },
    },
    {
      id: 7,
      content: <div style={{ color: "#000" }}>북문</div>,
      latlng: { lat: 37.296330, lng: 126.976435 },
    },
  ];

  const EventMarkerContainer = ({ position, content, id }) => {
    const map = useMap();

    function MarkerClickFunc(position) {
      setIsVisibleId(id);
      setTimeout(() => {
        map.panTo(position, { animate: { cancelable: false } });
      }, 10);
    }

    return (
      <MapMarker
        position={position}
        onClick={(marker) => {
          MarkerClickFunc(marker.getPosition(), id);
        }}
      >
        {isVisibleId === id && content}
      </MapMarker>
    );
  };

  if (!isLoaded) {
    return (
      <LoadingContainer>
        <div>지도를 불러오는 중...</div>
      </LoadingContainer>
    );
  }

  return (
    <MapContainer>
      <Map
        center={{
          lat: 37.293976,
          lng: 126.975059,
        }}
        style={{
          width: "100%",
          height: "100%",
        }}
        level={3}
        onClick={() => setIsVisibleId(-1)}
      >
        {data.map((value) => (
          <EventMarkerContainer
            key={`EventMarkerContainer-${value.latlng.lat}-${value.latlng.lng}`}
            position={value.latlng}
            content={value.content}
            id={value.id}
          />
        ))}
      </Map>
    </MapContainer>
  );
}

const LoadingContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f0f0f0;
`;

const MapContainer = styled.div`
  width: 100%;
  height: 100%;
`;