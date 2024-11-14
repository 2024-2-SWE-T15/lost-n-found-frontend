import { CenteredColumn } from "../components/Flex";
import { Spacer } from "../components/Spacer";
import styled from "styled-components";
import { useParams } from "react-router-dom";

function Post() {
  const { postId } = useParams();
  return (
    <Wrapper>
      <Header>Post page</Header>
      <Spacer size={20} />
      implement post page here (post id: &quot;{postId}&quot;)
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

export default Post;
