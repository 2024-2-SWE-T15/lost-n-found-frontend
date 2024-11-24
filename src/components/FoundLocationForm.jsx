import { confirmFoundLocation, goBackOnForm } from "../actions";

import styled from "styled-components";
import { useDispatch } from "react-redux";

function FoundLocationForm() {
  const dispatch = useDispatch();

  return (
    <Container>
      <BackButton
        onClick={() => {
          // @ts-ignore
          dispatch(goBackOnForm());
        }}
      >
        &#8592; 뒤로
      </BackButton>
      <Header>
        <Title>물건을 보관할 장소를 지정해주세요</Title>
      </Header>
      <Content>
        <RegisterButton
          onClick={() => {
            // @ts-ignore
            dispatch(confirmFoundLocation());
          }}
        >
          등록하기
        </RegisterButton>
      </Content>
    </Container>
  );
}

export default FoundLocationForm;

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 100vh;
  padding: 20px;
  position: relative;
`;

const Header = styled.div`
  position: absolute;
  top: 20px;
  text-align: center;
  width: 100%;
`;

const Title = styled.h1`
  font-size: 20px;
  font-weight: bold;
  margin: 40px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
`;

const RegisterButton = styled.button`
  padding: 15px 20px;
  border: none;
  border-radius: 6px;
  background-color: #4caf50;
  color: white;
  cursor: pointer;
  width: 100%;
  max-width: 300px;
  text-align: center;
  margin-top: 20px;
`;

const BackButton = styled.button`
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  background-color: transparent;
  color: #333;
  font-size: 16px;
  cursor: pointer;
`;
