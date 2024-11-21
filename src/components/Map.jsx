import { Map, MapMarker } from "react-kakao-maps-sdk";
import { useEffect, useState } from "react";

import CustomMarker from "./CustomMarker";
import { fetchMarkers } from "../api";
import { marker_types } from "../constants/map_const";
import styled from "styled-components";
import { useKakaoLoader } from "../hooks/useKakaoLoader";

export default function KakaoMap({
  selectedMarkerId,
  clickedPosition,
  onMarkerClick,
  onMapClick,
  setSidebarContent,
  isMarkerFixed,
}) {
  const isSdkLoaded = useKakaoLoader();
  const [markers, setMarkers] = useState([]);
  const [isMarkerLoaded, setIsMarkerLoaded] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(3);
  const [mapCenter, setMapCenter] = useState({
    lat: 37.293976,
    lng: 126.975059,
  });

  const handleLostButtonClick = () => {
    setSidebarContent("lost");
  };

  const handleFoundButtonClick = () => {
    setSidebarContent("found");
  };

  const updateMarkers = async () => {
    try {
      const markers = await fetchMarkers(mapCenter.lat, mapCenter.lng, 10000);

      setMarkers(
        markers.map((marker) => ({
          ...marker,
          content: <div style={{ color: "#000" }}>{marker.title}</div>,
          type: marker_types.KEPT_IDLE_PHASE, //임시
        }))
      );
    } catch (error) {
      console.error("마커 데이터를 불러오는데 실패했습니다:", error);
      setMarkers([]);
    }
  };

  //드래그, 줌 했을경우 마커 데이터 가져오기
  useEffect(() => {
    try {
      updateMarkers();
    } catch (error) {
      console.error("마커 데이터를 불러오는데 실패했습니다:", error);
    } finally {
      setIsMarkerLoaded(true);
    }
  }, [mapCenter, zoomLevel]);

  if (!isSdkLoaded || !isMarkerLoaded) {
    return (
      <LoadingContainer>
        <div>지도를 불러오는 중...</div>
      </LoadingContainer>
    );
  }

  return (
    <MapContainer>
      <Map
        center={mapCenter}
        style={{
          width: "100%",
          height: "100%",
        }}
        level={zoomLevel}
        onClick={(_, mouseEvent) => {
          const lat = mouseEvent.latLng.getLat();
          const lng = mouseEvent.latLng.getLng();

          onMapClick(lat, lng);
        }}
        onDragEnd={(map) => {
          const latlng = map.getCenter();
          const level = map.getLevel();

          setZoomLevel(level);
          setMapCenter({ lat: latlng.getLat(), lng: latlng.getLng() });
        }}
        onZoomChanged={(map) => {
          if (isMarkerFixed) return; // Prevent zooming if marker is fixed
          setZoomLevel(map.getLevel());
        }}
      >
        {/* Display marker for clicked position regardless of isMarkerFixed state */}
        {clickedPosition && (
          <MapMarker
            position={clickedPosition}
            image={{
              src: "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png",
              size: { width: 34, height: 44 },
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                width: "200px",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                backgroundColor: "white",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.3)",
              }}
            >
              <button
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  if (!isMarkerFixed) handleLostButtonClick();
                }}
              >
                여기서 잃어버림
              </button>
              <button
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#ff5733",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  if (!isMarkerFixed) handleFoundButtonClick();
                }}
              >
                여기서 찾았음
              </button>
            </div>
          </MapMarker>
        )}

        {/* Always display existing markers */}
        {markers.map((value) => (
          <CustomMarker
            key={value.id}
            id={value.id}
            type={value.type}
            position={value.latlng}
            isPopupOpened={selectedMarkerId === value.id}
            popupContent={value.content}
            onMarkerClick={onMarkerClick}
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
