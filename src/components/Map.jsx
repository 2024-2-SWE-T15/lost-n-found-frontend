import { Map, MapMarker, useMap } from "react-kakao-maps-sdk";
import { useEffect, useState } from "react";
import MarkerFactory from "./MarkerFactory";

import { SIDEBAR_WIDTH_PX } from "./Sidebar";
import { fetchMarkers } from "../api";
import styled from "styled-components";
import { useKakaoLoader } from "../hooks/useKakaoLoader";
import { marker_types, temp_marker_types } from "../constants/map_const";


export default function KakaoMap({selectedMarkerId, phase, onMarkerClick }) {
  const isSdkLoaded = useKakaoLoader();
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
          type: marker_types.KEEPED
        }))
      );
    } catch (error) {
      console.error("마커 데이터를 불러오는데 실패했습니다:", error);
      setMarkers([]);
    }
  };

  //marker add test(local)
  const addTempMarker = (lat, lng, temp_marker_type)=>
  {
    if(temp_marker_type == null || !(temp_marker_type in temp_marker_types))
    {
      console.error("temp_marker_type is not defined");
      return;
    }
    const new_marker = {
      id: markers.length,
      latlng: { lat: lat, lng: lng },
      content: <div style={{ color: "#000" }}>new marker</div>,
      type: temp_marker_type
    }

    setMarkers([...markers, new_marker]);
    return new_marker;
  }

  //marker remove test(local)
  const removeTempMarkerByID = (temp_marker_type) =>
  {
    setMarkers(markers.filter((marker) => marker.type !== temp_marker_type));
  }

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
          //change phase test
          if(phase == "IDLE")
          {
            const temp_marker = addTempMarker(mouseEvent.latLng.getLat(), mouseEvent.latLng.getLng(), temp_marker_types.TEMP_UNSET);
            onMarkerClick(temp_marker.id, temp_marker.type);
            
          }
          else if (phase == "CHOOSE_LOST_OR_FOUND")
          {
            removeTempMarkerByID(temp_marker_types.TEMP_UNSET); 
            onMarkerClick(null, null);
          }
          
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
          <MarkerFactory
            id={value.id}
            key={value.id}
            position={value.latlng}
            content={value.content}
            selectedMarkerId={selectedMarkerId}
            onMarkerClick={onMarkerClick}
            phase={phase}
            type={value.type}
            
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
