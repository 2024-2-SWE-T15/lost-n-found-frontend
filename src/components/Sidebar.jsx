import styled from "styled-components";
import PropTypes from "prop-types";

const Sidebar = ({ isSidebarOpen, sidebarClose, sidebarOpen, markerId }) => {
  return (
    <SidebarContainer $isOpen={isSidebarOpen}>
      <Content>
        <SearchInput 
          type="text" 
          placeholder=" 검색해주세요"
        />
        {markerId && (
          <MarkerInfo>
            선택된 마커 ID: {markerId}
          </MarkerInfo>
        )}
      </Content>
      <MenuButton 
          onClick={() => isSidebarOpen ? sidebarClose() : sidebarOpen()}
      />
    </SidebarContainer>
  );
};

const MarkerInfo = styled.div`
  margin-top: 20px;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 8px;
  font-size: 14px;
`;
const SidebarContainer = styled.div`
  position: absolute;
  top: 0;
  left: ${({ $isOpen }) => $isOpen ? '0' : '-30vw'};
  width: 30vw;
  height: 100%;
  background: white;
  box-shadow: 2px 0 8px rgba(0,0,0,0.1);
  transition: left 0.3s ease-in-out;
  z-index: 900;
`;

const Content = styled.div`
  padding: 20px;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 40px;
  padding: 0 15px;
  border: 1px solid #ddd;
  border-radius: 20px;
  outline: none;
  font-size: 14px;
  margin-top: 20px;
  
  &::placeholder {
    color: #999;
  }
`;

const MenuButton = styled.button`
  position: absolute;
  top: 50%;
  right: -35px;
  transform: translateY(-50%);
  padding: 16px 12px;
  background: white;
  border: none;
  border-radius: 0 12px 12px 0;
  box-shadow: 2px 0 6px rgba(0,0,0,0.1);
  cursor: pointer;
  z-index: 901;
  
  &::before {
    content: '';
    display: block;
    width: 0;
    height: 0;
    border-top: 12px solid transparent;
    border-bottom: 12px solid transparent;
    border-left: 12px solid #666;
  }

  &:hover {
    background: #f8f8f8;
  }
`;

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onOpen: PropTypes.func.isRequired
};

export default Sidebar;