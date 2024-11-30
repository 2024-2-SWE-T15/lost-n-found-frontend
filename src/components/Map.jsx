// @ts-nocheck

import {
  centerChanged,
  clickMap,
  levelChanged,
  mapInitialized,
} from "../actions";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import CustomMarker from "./CustomMarker";
import { Map } from "react-kakao-maps-sdk";
import { selectMap } from "../selector";
import styled from "styled-components";
import { useKakaoLoader } from "../hooks/useKakaoLoader";

const DEFAULT_CENTER = { lat: 37.293976, lng: 126.975059 };
const DEFAULT_LEVEL = 3;

export default function KakaoMap() {
  const dispatch = useDispatch();
  const { activeMarkerId, markerMap } = useSelector(selectMap);
  const isSdkLoaded = useKakaoLoader();
  const [map, setMap] = useState(null);
  const [centerChangeEvent, triggerCenterChange] = useState(null);

  useEffect(() => {
    if (map) {
      dispatch(mapInitialized(map));
    }
  }, [map, dispatch]);

  useEffect(() => {
    if (centerChangeEvent && map) {
      const timeout = setTimeout(() => dispatch(centerChanged(map)), 300);
      return () => clearTimeout(timeout);
    }
  }, [centerChangeEvent, map, dispatch]);

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
        center={DEFAULT_CENTER}
        level={DEFAULT_LEVEL}
        style={{
          width: "100%",
          height: "100%",
        }}
        onCreate={setMap}
        onClick={(_, mouseEvent) => {
          const latLng = mouseEvent.latLng;
          dispatch(clickMap(latLng.getLat(), latLng.getLng()));
        }}
        onCenterChanged={() => triggerCenterChange({})}
        onZoomChanged={(map) => dispatch(levelChanged(map))}
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
