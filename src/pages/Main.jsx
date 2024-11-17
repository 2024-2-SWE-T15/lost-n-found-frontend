import KakaoMap from "../components/Map";
import Sidebar from "../components/Sidebar";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import LostForm from "../components/LostForm";
import FoundForm from "../components/FoundForm";

function Main() {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [selectedMarkerId, setSelectedMarkerId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [sidebarContent, setSidebarContent] = useState(""); // 추가된 상태
  const [coordinates, setCoordinates] = useState([null, null]); // State to hold coordinates
  const navigate = useNavigate();

  function HandleMarkerClick(id) {
    if (id === null) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }

    setSelectedMarkerId(id);
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
            onMarkerClick={HandleMarkerClick}
            setSidebarContent={setSidebarContent}
            setCoordinates={setCoordinates}
          />
        </MapContainer>
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {/* 조건부 렌더링 */}
          {sidebarContent === "lost" ? (
            <LostForm coordinates={coordinates} />
          ) : sidebarContent === "found" ? (
            <FoundForm />
          ) : (
            <p>기본 Sidebar 콘텐츠: {selectedMarkerId}</p> // 이곳에 기본값 추가 등 진행
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
