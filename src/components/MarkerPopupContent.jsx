import { enterFoundForm, enterLostForm } from "../actions";

import { SCENE } from "../store";
import styled from "styled-components";
import { useDispatch } from "react-redux";

// to handle empty popup content correctly,
// it does NOT follow functional component format
const renderMarkerPopupContent = (scene) => {
  const content = (() => {
    switch (scene) {
      case SCENE.INITIAL:
        return <PostSelectButtons />;
      default:
        return null;
    }
  })();

  if (content === null) {
    return null;
  }

  return <PopupWrapper>{content}</PopupWrapper>;
};

const PostSelectButtons = () => {
  const dispatch = useDispatch();

  return (
    <>
      <LostHereButton
        onClick={() => {
          // @ts-ignore
          dispatch(enterLostForm());
        }}
      >
        여기서 잃어버림
      </LostHereButton>
      <FoundHereButton
        onClick={() => {
          // @ts-ignore
          dispatch(enterFoundForm());
        }}
      >
        여기서 찾았음
      </FoundHereButton>
    </>
  );
};

const PopupWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 200px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.3);
`;

const LostHereButton = styled.button`
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const FoundHereButton = styled.button`
  padding: 10px 20px;
  background-color: #ff5733;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

export default renderMarkerPopupContent;
