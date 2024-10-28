import { CenteredColumn } from "../components/Flex";
import { Spacer } from "../components/Spacer";
import styled from "styled-components";

function MyPage() {
  return (
    <Wrapper>
      <Header>My page</Header>
      <Spacer size={20} />
      implement my page here
    </Wrapper>
  );
}

const Wrapper = styled(CenteredColumn)`
  width: 100vw;
  height: 100dvh;
`;

const Header = styled.h1`
  font-size: 32px;
  font-weight: bold;
`;

export default MyPage;
