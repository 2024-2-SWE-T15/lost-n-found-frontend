import { CenteredColumn } from "../components/Flex";
import { Link } from "react-router-dom";
import { Spacer } from "../components/Spacer";
import styled from "styled-components";

function NotFound() {
  return (
    <Wrapper>
      <Header>404 Not Found</Header>
      <Spacer size={20} />
      <Link to="/">Go back to main page</Link>
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

export default NotFound;
