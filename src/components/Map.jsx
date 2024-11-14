import { Map, MapMarker, useMap } from "react-kakao-maps-sdk";
import { useState, useEffect, useMemo } from "react";
import { useKakaoLoader } from "../hooks/useKakaoLoader";
import styled from "styled-components";
import axios from 'axios';
import { transformMarkerData } from './api';

export default function KakaoMap({  onMarkerClick }) {
  const isSdkLoaded = useKakaoLoader();
  const [selectedMarkerId, setSelectedMarkerId] = useState("");
  const [markers, setMarkers] = useState([]);
  const [isMarkerLoaded, setisMarkerLoaded] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(3);
  const [mapCenter, setMapCenter] = useState({
    lat: 37.293976, lng: 126.975059
  });


  const fetchMarkers = async () => {
    try {
      const response = await axios.get(`https://caring-sadly-marmoset.ngrok-free.app/marker/`, {
        headers: {
          "ngrok-skip-browser-warning": true,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        withCredentials: true,
        params: {
          lng: mapCenter.lng,
          lat: mapCenter.lat,
          distance: 100000
        }
      }).then(response => {
        console.log(response);
        if (response.data) {
          console.log(response.data);
          const transformedMarkers = transformMarkerData(response.data);
          setMarkers(transformedMarkers);

          console.log('markers 변경');
          console.log(markers);
        }
      });
      
     
    } catch (error) {
      console.error('마커 데이터를 불러오는데 실패했습니다:', error);
      setMarkers([]);
    }
  };


  //드래그, 줌 했을경우 마커 데이터 가져오기
  useEffect(() => {
    try {
      setisMarkerLoaded(false);
      fetchMarkers();
      console.log('드래그 후 새로운 중심좌표:', mapCenter);
      console.log('드래그 후 새로운 level:', zoomLevel);
    } catch (error) {
      console.error('마커 데이터를 불러오는데 실패했습니다:', error);
    } finally {
      setisMarkerLoaded(true);
    }
  }, [mapCenter, zoomLevel]);

  



  

  const EventMarkerContainer = ({ position, content, id }) => {
    const map = useMap();
    console.log(position);
    function MarkerClickFunc(position, id) {
      setSelectedMarkerId(id);
      onMarkerClick(id);
      
      setTimeout(() => {
        const newPosition = new kakao.maps.LatLng(
          position.getLat(),
          position.getLng()
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
        center={ mapCenter}
        style={{
          width: "100%",
          height: "100%",
        }}
        level={zoomLevel}
        onClick={() => {
          setSelectedMarkerId("");
          onMarkerClick(null);

        } }
        onDragEnd={(map) => {
          const latlng = map.getCenter();
          const level = map.getLevel()
          const newCenter = {
            lat: latlng.getLat(),
            lng: latlng.getLng()
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