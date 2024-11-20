import { Map, MapMarker, useMap } from "react-kakao-maps-sdk";
import { useEffect, useState } from "react";

import { SIDEBAR_WIDTH_PX } from "./Sidebar";
import { fetchMarkers } from "../api";
import styled from "styled-components";
import { useKakaoLoader } from "../hooks/useKakaoLoader";

export default function KakaoMap({ onMarkerClick, setSidebarContent, setCoordinates, isMarkerFixed, setPlacementCoordinates }) {
  const isSdkLoaded = useKakaoLoader();
  const [selectedMarkerId, setSelectedMarkerId] = useState("");
  const [markers, setMarkers] = useState([]);
  const [isMarkerLoaded, setIsMarkerLoaded] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(3);
  const [mapCenter, setMapCenter] = useState({
    lat: 37.293976,
    lng: 126.975059,
  });
  const [clickedPosition, setClickedPosition] = useState(null);
  const [placementMarkerPosition, setPlacementMarkerPosition] = useState(null); // 찾은 사람이 물건을 둘 위치

  // 지도 클릭 시 마커 표시
  const handleMapClick = (_target, mouseEvent) => {
    const lat = mouseEvent.latLng.getLat();
    const lng = mouseEvent.latLng.getLng();

    if (isMarkerFixed) {
      // Handle special marker placement when isMarkerFixed is true
      const newPosition = { lat, lng };
      setPlacementMarkerPosition(newPosition);
      if (setPlacementCoordinates) {
        setPlacementCoordinates(newPosition); // Main에 전달
      }
      // console.log("New marker coordinates (Fixed Mode):", { lat, lng });
    } else {
      // console.log("Clicked position:", { lat, lng });

      if (setCoordinates) {
        setCoordinates([lat, lng]);
      }

      // Check for overlap with existing markers
      const overlappingMarker = markers.find(
        (marker) =>
          Math.abs(marker.latlng.lat - lat) < 0.0001 &&
          Math.abs(marker.latlng.lng - lng) < 0.0001
      );

      if (overlappingMarker) {
        setSelectedMarkerId(overlappingMarker.id);
        setClickedPosition(null); // Clear clicked position marker
      } else {
        setSelectedMarkerId(""); // Deselect any existing markers
        setClickedPosition({ lat, lng });
      }
    }
  };

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
      // console.log("드래그 후 새로운 중심좌표:", mapCenter);
      // console.log("드래그 후 새로운 level:", zoomLevel);
    } catch (error) {
      console.error("마커 데이터를 불러오는데 실패했습니다:", error);
    } finally {
      setIsMarkerLoaded(true);
    }
  }, [mapCenter, zoomLevel]);

  const EventMarkerContainer = ({ position, content, id }) => {
    const map = useMap();
    const projection = map.getProjection();
    // console.log(position);
    function MarkerClickFunc(position, id) {
      setSelectedMarkerId(id);
      setClickedPosition(null); // 기존에 생성되어있는 마커를 클릭하면 새로운 마커는 없애줍니다.
      onMarkerClick(id);

      setTimeout(() => {
        // click event causes the sidebar to open, so we need to adjust the map center
        const sidebarTopLeft = projection.coordsFromContainerPoint(
          // eslint-disable-next-line no-undef
          new kakao.maps.Point(0, 0)
        );
        const sidebarTopRight = projection.coordsFromContainerPoint(
          // eslint-disable-next-line no-undef
          new kakao.maps.Point(SIDEBAR_WIDTH_PX, 0)
        );

        const latOffset =
          (sidebarTopLeft.getLat() - sidebarTopRight.getLat()) / 2;
        const lngOffset =
          (sidebarTopLeft.getLng() - sidebarTopRight.getLng()) / 2;

        // eslint-disable-next-line no-undef
        const newPosition = new kakao.maps.LatLng(
          position.getLat() + latOffset,
          position.getLng() + lngOffset
        );

        map.panTo(newPosition);
      }, 10);
    }

    return (
      <MapMarker
        position={position}
        onClick={(marker) => {
          MarkerClickFunc(marker.getPosition(), id);
        }}
      >
        {selectedMarkerId === id && content}
      </MapMarker>
    );
  };

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
        onClick={handleMapClick} // Handle map clicks
        onDragEnd={(map) => {
          if (isMarkerFixed) return; // Prevent dragging if marker is fixed
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
  
        {/* Display special marker when isMarkerFixed is true */}
        {isMarkerFixed && placementMarkerPosition && (
          <MapMarker
            position={placementMarkerPosition}
            image={{
              src: "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png", // Example marker (change color/image as needed)
              size: { width: 34, height: 44 },
            }}
          />
        )}
  
        {/* Always display existing markers */}
        {markers.map((value) => (
          <EventMarkerContainer
            key={value.id}
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
