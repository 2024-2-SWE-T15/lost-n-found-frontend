import { CenteredColumn, Column } from "../components/Flex";
import {
  selectActiveMarker,
  selectProfileMenu,
  selectScene,
} from "../selector";
import { useDispatch, useSelector } from "react-redux";

import FoundForm from "../components/FoundForm";
import FoundLocationForm from "../components/FoundLocationForm";
import KakaoMap from "../components/Map";
import LostForm from "../components/LostForm";
import MarkerDetails from "../components/MarkerDetails";
import { MdClose } from "react-icons/md";
import { SCENE } from "../store";
import SearchBar from "../components/SearchBar";
import SearchResult from "../components/SearchResult";
import Sidebar from "../components/Sidebar";
import { Spacer } from "../components/Spacer";
import { clearSearch } from "../actions/search";
import styled from "styled-components";
import { toggleProfileMenu } from "../actions";
import { useNavigate } from "react-router-dom";

function Main() {
  const dispatch = useDispatch();
  const { opened: profileMenuOpened } = useSelector(selectProfileMenu);
  const scene = useSelector(selectScene);
  const activeMarker = useSelector(selectActiveMarker);

  const navigate = useNavigate();

  const sidebarContent = (() => {
    switch (scene) {
      case SCENE.SEARCH_RESULT:
        return (
          <>
            <SearchBar />
            <Spacer size={4} />
            <ClearFilterButton
              onClick={() =>
                dispatch(
                  // @ts-ignore
                  clearSearch()
                )
              }
            >
              <MdClose size={14} />
              검색 취소
            </ClearFilterButton>
            <RemainingArea>
              <SearchResult />
            </RemainingArea>
          </>
        );
      case SCENE.LOST_DETAILS_FORM:
        return <LostForm />;
      case SCENE.FOUND_DETAILS_FORM:
        return <FoundForm />;
      case SCENE.KEPT_LOCATION_PICKER:
        return <FoundLocationForm />;
      // case SCENE.INITIAL:
      default:
        return (
          <>
            <SearchBar />
            {activeMarker?.data ? (
              <MarkerDetails markerData={activeMarker.data} />
            ) : (
              <HelperText>검색하거나 장소를 선택해주세요.</HelperText>
            )}
          </>
        );
    }
  })();

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
          {sidebarContent}
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

const ClearFilterButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  padding: 4px 0;
  gap: 4px;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;

  font-size: 12px;
  color: #666;

  &:hover {
    background-color: #eee;
  }
`;

const RemainingArea = styled(Column)`
  flex: 1 1 auto;
  width: 100%;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const HelperText = styled(CenteredColumn)`
  flex: 1 0 auto;
  font-size: 24px;
  color: #666;
  text-align: center;
`;

export default Main;
