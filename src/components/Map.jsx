import { Map, MapMarker, useMap } from "react-kakao-maps-sdk";
import { useEffect, useState } from "react";

import { SIDEBAR_WIDTH_PX } from "./Sidebar";
import { fetchMarkers } from "../api";
import styled from "styled-components";
import { useKakaoLoader } from "../hooks/useKakaoLoader";

export default function KakaoMap({ onMarkerClick }) {
  const isSdkLoaded = useKakaoLoader();
  const [selectedMarkerId, setSelectedMarkerId] = useState("");
  const [markers, setMarkers] = useState([]);
  const [isMarkerLoaded, setIsMarkerLoaded] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(3);
  const [mapCenter, setMapCenter] = useState({
    lat: 37.293976,
    lng: 126.975059,
  });

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
      console.log("드래그 후 새로운 중심좌표:", mapCenter);
      console.log("드래그 후 새로운 level:", zoomLevel);
    } catch (error) {
      console.error("마커 데이터를 불러오는데 실패했습니다:", error);
    } finally {
      setIsMarkerLoaded(true);
    }
  }, [mapCenter, zoomLevel]);

  const EventMarkerContainer = ({ position, content, id }) => {
    const map = useMap();
    const projection = map.getProjection();
    console.log(position);
    function MarkerClickFunc(position, id) {
      setSelectedMarkerId(id);
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
        onClick={() => {
          setSelectedMarkerId("");
          onMarkerClick(null);
        }}
        onDragEnd={(map) => {
          const latlng = map.getCenter();
          const level = map.getLevel();
          const newCenter = {
            lat: latlng.getLat(),
            lng: latlng.getLng(),
          };

          setZoomLevel(level);
          setMapCenter(newCenter);
        }}
        onZoomChanged={(map) => {
          setZoomLevel(map.getLevel());
        }}
      >
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
