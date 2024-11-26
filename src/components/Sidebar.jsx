// @ts-nocheck
import { useDispatch, useSelector } from "react-redux";

import { selectSidebar } from "../selector";
import styled from "styled-components";
import { toggleSidebar } from "../actions";

const SIDEBAR_PADDING_PX = 20;

export const SIDEBAR_FULL_WIDTH_PX = 400;
export const SIDEBAR_CONTENT_WIDTH_PX =
  SIDEBAR_FULL_WIDTH_PX - SIDEBAR_PADDING_PX * 2;

const Sidebar = ({ children }) => {
  const dispatch = useDispatch();
  const { opened: sidebarOpened } = useSelector(selectSidebar);

  return (
    <SidebarContainer $isOpen={sidebarOpened}>
      <Content>{children}</Content>
      <MenuButton
        onClick={() => dispatch(toggleSidebar())}
        $isOpen={sidebarOpened}
      />
    </SidebarContainer>
  );
};

const SidebarContainer = styled.div`
  position: absolute;
  top: 0;
  left: ${({ $isOpen }) => ($isOpen ? "0" : `-${SIDEBAR_FULL_WIDTH_PX}px`)};
  width: ${SIDEBAR_FULL_WIDTH_PX}px;
  height: 100%;
  background: white;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  transition: left 0.3s ease-in-out;
  z-index: 900;
`;

const Content = styled.div`
  padding: ${SIDEBAR_PADDING_PX}px;
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
