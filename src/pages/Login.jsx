import { CenteredColumn } from "../components/Flex";
import { Spacer } from "../components/Spacer";
import styled from "styled-components";

function Login() {
  return (
    <Wrapper>
      <Header>Login page</Header>
      <Spacer size={20} />
      implement login page here
    </Wrapper>
  );
}

const Wrapper = styled(CenteredColumn)`
  width: 100%;
  height: 100%;
`;

const Header = styled.h1`
  font-size: 32px;
  font-weight: bold;
`;

export default Login;
