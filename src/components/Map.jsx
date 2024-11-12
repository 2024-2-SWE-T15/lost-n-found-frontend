import { Map, MapMarker, useMap } from "react-kakao-maps-sdk";
import { useState, useEffect, useMemo } from "react";
import { useKakaoLoader } from "../hooks/useKakaoLoader";
import styled from "styled-components";
import axios from 'axios';

export default function KakaoMap({ onOpen }) {
  const isLoaded = useKakaoLoader();
  const [isVisibleId, setIsVisibleId] = useState(-1);
  const [markers, setMarkers] = useState([{
    id: 0,
    content: <div style={{ color: "#000" }}>학술정보관</div>,
    latlng: { lat: 37.293976, lng: 126.975059 },
  }]);
  const [isLoading, setIsLoading] = useState(true);
  const [nextId, setNextId] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(3);
  const [mapCenter, setMapCenter] = useState({
    lat: 37.293976,
    lng: 126.975059,
  });
  const [markerElements, setMarkerElements] = useState([]);
  

  useEffect(() => {
    try {
      // 여기서 마커 데이터 가져오기
      const newMarker = {
        id: nextId,
        content: <div style={{ color: "#000" }}>새로운 마커 {nextId}</div>,
        latlng: {
          lat: mapCenter.lat + (Math.random() * 0.001 - 0.0005),
          lng: mapCenter.lng + (Math.random() * 0.001 - 0.0005)
        }
      };
      setMarkers( [newMarker]);
      console.log('드래그 후 새로운 중심좌표:', mapCenter);
      console.log('드래그 후 새로운 level:', zoomLevel);
    } catch (error) {
      console.error('마커 데이터를 불러오는데 실패했습니다:', error);
    } finally {
      setIsLoading(false);
    }
  }, [mapCenter, zoomLevel]);

  useEffect(() => {
    console.log('markers 변경');
    const newMarkerElements = markers.map((marker) => (
      <EventMarkerContainer
        key={marker.id}
        position={marker.latlng}
        content={marker.content}
        id={marker.id}
      />
    ));
    setMarkerElements(newMarkerElements);
  }, [markers]);

  

  const EventMarkerContainer = ({ position, content, id }) => {
    const map = useMap();
    
    function MarkerClickFunc(position) {
      setIsVisibleId(id);
      onOpen();
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

  if (!isLoaded || isLoading) {
    return (
      <LoadingContainer>
        <div>지도를 불러오는 중...</div>
      </LoadingContainer>
    );
  }

  return (
    <MapContainer>
      <Map
        center={ mapCenter}
        style={{
          width: "100%",
          height: "100%",
        }}
        level={zoomLevel}
        onClick={() => setIsVisibleId(-1)}
        onDragEnd={(map) => {
          const latlng = map.getCenter();
          const level = map.getLevel()
          const newCenter = {
            lat: latlng.getLat(),
            lng: latlng.getLng()
          };
          
         
          
          
          setNextId(prev => prev + 1);
          setZoomLevel(level);
          setMapCenter(newCenter);
        }}
        onZoomChanged={(map) => {
          setZoomLevel(map.getLevel());
        }}
      >
        {markerElements}
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