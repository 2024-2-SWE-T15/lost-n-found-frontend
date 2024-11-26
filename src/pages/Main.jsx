import { selectProfileMenu, selectScene } from "../selector";
import { useDispatch, useSelector } from "react-redux";

import FoundForm from "../components/FoundForm";
import FoundLocationForm from "../components/FoundLocationForm";
import KakaoMap from "../components/Map";
import LostForm from "../components/LostForm";
import { SCENE } from "../store";
import Sidebar from "../components/Sidebar";
import styled from "styled-components";
import { toggleProfileMenu } from "../actions";
import { useNavigate } from "react-router-dom";

function Main() {
  const dispatch = useDispatch();
  const { opened: profileMenuOpened } = useSelector(selectProfileMenu);
  const scene = useSelector(selectScene);

  const navigate = useNavigate();

  return (
    <Container>
      <TopBar>
        <ProfileContainer>
          <ProfileButton onClick={() => dispatch(toggleProfileMenu())}>
            <img src="/user-icon.svg" alt="프로필" />
          </ProfileButton>
          {profileMenuOpened && (
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
          <KakaoMap />
        </MapContainer>
        <Sidebar>
          {/* Conditional rendering logic */}
          {scene === SCENE.LOST_DETAILS_FORM ? (
            <LostForm />
          ) : scene === SCENE.FOUND_DETAILS_FORM ? (
            <FoundForm />
          ) : scene === SCENE.KEPT_LOCATION_PICKER ? (
            <FoundLocationForm />
          ) : (
            <p>마커를 선택하거나 검색해주세요.</p>
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
