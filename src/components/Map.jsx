// @ts-nocheck

import { clickMap, refreshMap } from "../actions";
import { selectMap, selectScene } from "../selector";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import CustomMarker from "./CustomMarker";
import { Map } from "react-kakao-maps-sdk";
import styled from "styled-components";
import { useKakaoLoader } from "../hooks/useKakaoLoader";

const DEFAULT_CENTER = { lat: 37.293976, lng: 126.975059 };
const DEFAULT_LEVEL = 3;

export default function KakaoMap() {
  const dispatch = useDispatch();
  const { activeMarkerId, markerMap } = useSelector(selectMap);
  const scene = useSelector(selectScene);
  const isSdkLoaded = useKakaoLoader();

  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [level, setLevel] = useState(DEFAULT_LEVEL);

  useEffect(() => {
    if (isSdkLoaded) {
      dispatch(refreshMap(center.lat, center.lng));
    }
  }, [dispatch, isSdkLoaded, scene, center]);

  if (!isSdkLoaded) {
    return (
      <LoadingContainer>
        <div>지도를 불러오는 중...</div>
      </LoadingContainer>
    );
  }

  return (
    <MapContainer>
      <Map
        center={center}
        level={level}
        style={{
          width: "100%",
          height: "100%",
        }}
        onClick={(_, mouseEvent) => {
          const latLng = mouseEvent.latLng;
          dispatch(clickMap(latLng.getLat(), latLng.getLng()));
        }}
        onCenterChanged={(map) => {
          const center = map.getCenter();
          setCenter({ lat: center.getLat(), lng: center.getLng() });
        }}
        onZoomChanged={(map) => {
          setLevel(map.getLevel());
        }}
      >
        {Object.entries(markerMap)
          .filter(([, marker]) => marker !== null && marker !== undefined)
          .map(([id, marker]) => (
            <CustomMarker
              key={id}
              id={id}
              marker={marker}
              isActive={activeMarkerId === id}
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
