import {
  marker_types,
  phases,
  temp_marker_types,
} from "../constants/map_const";

import FoundForm from "../components/FoundForm";
import FoundLocationForm from "../components/FoundLocationForm";
import KakaoMap from "../components/Map";
import LostForm from "../components/LostForm";
import Sidebar from "../components/Sidebar";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Main() {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [selectedMarkerId, setSelectedMarkerId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [clickedPosition, setClickedPosition] = useState(null);
  const [sidebarContent, setSidebarContent] = useState("");
  const [coordinates, setCoordinates] = useState([null, null]);
  const [foundFormData, setFoundFormData] = useState(null);
  const [placementCoordinates, setPlacementCoordinates] = useState(null); // 분실물 놔둘 위치 (FoundLostCocation)
  const [phase, setPhase] = useState(phases.IDLE);

  const navigate = useNavigate();
  console.log(phase);

  // 지도 클릭 시 마커 표시
  const handleMapClick = (lat, lng) => {
    if (foundFormData) {
      // Handle special marker placement when isMarkerFixed is true
      const newPosition = { lat, lng };
      setPlacementCoordinates(newPosition);
    } else {
      setCoordinates([lat, lng]);
      setSelectedMarkerId(""); // Deselect any existing markers
      setClickedPosition({ lat, lng });
    }
  };

  function HandleMarkerClick(id, marker_type) {
    setSelectedMarkerId(id);
    setClickedPosition(null); // 기존에 생성되어있는 마커를 클릭하면 새로운 마커는 없애줍니다.

    switch (phase) {
      case phases.IDLE:
        if (id === null) {
          //click ground
          setIsSidebarOpen(false);
        } else if (marker_type in marker_types) {
          // click existing marker
          setIsSidebarOpen(true);
        } else if (marker_type === temp_marker_types.TEMP_UNSET) {
          //click new temp marker
          console.log("choose lost or found");
          setPhase(phases.CHOOSE_LOST_OR_FOUND);
          setIsSidebarOpen(true);
        }

        break;
      case phases.CHOOSE_LOST_OR_FOUND:
        if (id == null) {
          //click ground
          setPhase(phases.IDLE);
          setIsSidebarOpen(false);
        } //click marker
        else {
          setSelectedMarkerId(id);
          setIsSidebarOpen(true);
        }
        break;

      case phases.ADD_FOUND_MARKER:
        break;
      case phases.ADD_LOST_MARKER:
        break;

      case phases.ADD_KEEPED_MARKER:
        break;

      default:
        console.log("phase error");
        break;
    }
  }

  return (
    <Container>
      <TopBar>
        <ProfileContainer>
          <ProfileButton
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
          >
            <img src="/user-icon.svg" alt="프로필" />
          </ProfileButton>
          {isProfileMenuOpen && (
            <ProfileMenu>
              <MenuItem onClick={() => navigate("/my")}>내 정보</MenuItem>
              <MenuDivider />
              <MenuItem onClick={() => navigate("/login")}>로그아웃</MenuItem>
            </ProfileMenu>
          )}
        </ProfileContainer>
      </TopBar>
      <ContentContainer>
        <MapContainer>
          {/* Pass setSidebarContent as a prop */}
          <KakaoMap
            selectedMarkerId={selectedMarkerId}
            onMarkerClick={HandleMarkerClick}
            onMapClick={handleMapClick}
            clickedPosition={clickedPosition}
            setSidebarContent={setSidebarContent}
            isMarkerFixed={!!foundFormData}
          />
        </MapContainer>
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {/* Conditional rendering logic */}
          {sidebarContent === "lost" ? (
            <LostForm coordinates={coordinates} />
          ) : sidebarContent === "found" ? (
            foundFormData ? (
              <FoundLocationForm
                requestBody={foundFormData}
                goBack={() => setFoundFormData(null)} // Pass the goBack handler
                initialCoordinates={placementCoordinates}
              />
            ) : (
              <FoundForm
                setFoundFormData={setFoundFormData}
                coordinates={coordinates}
              />
            )
          ) : (
            <p>기본 Sidebar 콘텐츠: {selectedMarkerId}</p>
          )}
        </Sidebar>
      </ContentContainer>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const TopBar = styled.div`
  height: 60px;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  z-index: 1000;
`;

const ProfileContainer = styled.div`
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
  padding-right: 20px;
`;

const ProfileButton = styled.button`
  width: 40px;
  height: 40px;
  border: none;
  background: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
  }
`;

const ProfileMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 2px;
  background: white;
  min-width: 160px;
  border: 1px solid #eee;
  border-top: none;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 999;
`;

const MenuItem = styled.button`
  width: 100%;
  padding: 12px 20px;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  display: block;

  &:hover {
    background: #f5f5f5;
  }
`;

const MenuDivider = styled.div`
  height: 1px;
  background: #eee;
`;

const ContentContainer = styled.div`
  flex: 1;
  position: relative;
`;

const MapContainer = styled.div`
  flex: 1 1 100%;
  height: 100%;
`;

export default Main;
