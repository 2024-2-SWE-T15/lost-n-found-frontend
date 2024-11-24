import { useEffect, useState } from "react";

import styled from "styled-components";

export const SIDEBAR_WIDTH_PX = 400;

const Sidebar = ({ children, isSidebarOpen, onSidebarToggle }) => {
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    let resizeTimer;

    const handleResize = () => {
      setIsResizing(true);
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setIsResizing(false);
      }, 100);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <SidebarContainer $isOpen={isSidebarOpen} $isResizing={isResizing}>
      <Content>
        {children || <p>이곳에 예시 문구가 표시됩니다. 이 문구는 기본 내용입니다.</p>}
      </Content>
      <MenuButton onClick={onSidebarToggle} $isOpen={isSidebarOpen} />
    </SidebarContainer>
  );
};

const SidebarContainer = styled.div`
  position: absolute;
  top: 0;
  left: ${({ $isOpen }) => ($isOpen ? "0" : `-${SIDEBAR_WIDTH_PX}px`)};
  width: ${SIDEBAR_WIDTH_PX}px;
  height: 100%;
  background: white;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  transition: left 0.3s ease-in-out;
  z-index: 900;
`;

const Content = styled.div`
  padding: 20px;
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
  box-shadow: 2px 0 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  z-index: 901;

  &::before {
    content: "";
    display: block;
    width: 0;
    height: 0;
    border-top: 12px solid transparent;
    border-bottom: 12px solid transparent;
    border-left: 12px solid #666;
    transform: rotate(${({ $isOpen }) => ($isOpen ? "180deg" : "0")});
  }

  &:hover {
    background: #f8f8f8;
  }
`;

export default Sidebar;
