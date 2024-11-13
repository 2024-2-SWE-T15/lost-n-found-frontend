import { Map, MapMarker, useMap } from "react-kakao-maps-sdk";
import { useState, useEffect, useMemo } from "react";
import { useKakaoLoader } from "../hooks/useKakaoLoader";
import styled from "styled-components";
import axios from 'axios';

export default function KakaoMap({ sidebarOpen,sidebarClose, onMarkerClick }) {
  const isLoaded = useKakaoLoader();
  const [isVisibleId, setIsVisibleId] = useState("");
  const [markers, setMarkers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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
          lng: 92,
          lat: -42,
          distance: 100000
        }
      }).then(response => {
        console.log(response);
        if (response.data) {
          console.log(response.data);
          let diff = 0;
          const transformedMarkers = response.data.map(marker => ({
            id: marker.id,
            content: <div style={{ color: "#000" }}>{ marker.id}</div>, //테스트용
            latlng: { 
              lat: marker.coordinates[1] - 55.62786535,  //위도 (테스트용)
              lng: marker.coordinates[0] + 169.17110113 + 0.0005*(diff++), //경도 (테스트용)
            },
            isLost: marker.is_lost,
            matchRank: marker.match_rank,
            description: marker.description,
            createTime: marker.create_time,
            updateTime: marker.update_time,
            userId: marker.user_id,
            valid: marker.valid
          }));
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


  //페이지 로드시 마커 데이터 가져오기
  useEffect(() => {
    fetchMarkers();
  }, []);

  //드래그, 줌 했을경우 마커 데이터 가져오기
  useEffect(() => {
    try {
      fetchMarkers();
      console.log('드래그 후 새로운 중심좌표:', mapCenter);
      console.log('드래그 후 새로운 level:', zoomLevel);
    } catch (error) {
      console.error('마커 데이터를 불러오는데 실패했습니다:', error);
    } finally {
      setIsLoading(false);
    }
  }, [mapCenter, zoomLevel]);

  



  

  const EventMarkerContainer = ({ position, content, id }) => {
    const map = useMap();
    
    function MarkerClickFunc(position, id) {
      setIsVisibleId(id);
      sidebarOpen();
      onMarkerClick(id);
      
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
        onClick={() => {
          setIsVisibleId("");
          onMarkerClick(null);
          sidebarClose();

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