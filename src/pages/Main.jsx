import KakaoMap from "../components/Map";
import Sidebar from "../components/Sidebar";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { phases , marker_types, temp_marker_types} from "../constants/map_const";

function Main() {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [selectedMarkerId, setSelectedMarkerId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [phase, setPhase] = useState(phases.IDLE)

  const navigate = useNavigate();
  console.log(phase)

  function HandleMarkerClick(id, marker_type) {

    setSelectedMarkerId(id);

    switch(phase)
    {
      case phases.IDLE:
        if(id === null) //click ground
        {
          setIsSidebarOpen(false);
        }
        else if(marker_type in marker_types) // click existing marker
        {
          setIsSidebarOpen(true);
        }
        else if(marker_type === temp_marker_types.TEMP_UNSET) //click new temp marker
        {
          console.log("choose lost or found")
          setPhase(phases.CHOOSE_LOST_OR_FOUND);
          setIsSidebarOpen(true);
        }
        
        break;
      case phases.CHOOSE_LOST_OR_FOUND:
        if(id == null) //click ground 
        {
          setPhase(phases.IDLE);
          setIsSidebarOpen(false);
        }
        else//click marker
        {
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
        console.log("phase error")
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
          <KakaoMap 
            selectedMarkerId={selectedMarkerId}
            phase={phase}
            onMarkerClick={HandleMarkerClick} />
        </MapContainer>
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {/* TODO: put dynamic content here */}
          {selectedMarkerId}
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
