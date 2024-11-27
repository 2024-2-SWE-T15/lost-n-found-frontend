import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { CenteredColumn } from "../components/Flex";
import { MdError } from "react-icons/md";
import PostDetails from "../components/PostDetails";
import { Spacer } from "../components/Spacer";
import { fetchPost } from "../api";
import styled from "styled-components";

const LOADING = "loading";
const ERROR = "error";

function Post() {
  const navigate = useNavigate();
  const { postId } = useParams();
  const [postData, setPostData] = useState(LOADING);

  useEffect(() => {
    // prevent double fetch on strict mode
    const timeout = setTimeout(() => {
      setPostData(LOADING);
      fetchPost(postId)
        // @ts-ignore
        .then(setPostData)
        .catch(() => setPostData(ERROR));
    }, 0);

    return () => clearTimeout(timeout);
  }, [postId]);

  return (
    <Wrapper>
      {postData === LOADING ? (
        <CenteredColumn>포스트 불러오는 중...</CenteredColumn>
      ) : postData === ERROR ? (
        <CenteredColumn>
          <MdError color="#ec6862" size={200} />
          포스트를 불러오지 못했습니다.
          <Spacer size={12} />
          <BackButton onClick={() => navigate(-1)}>뒤로 가기</BackButton>
        </CenteredColumn>
      ) : (
        <PostDetailsWrapper>
          <PostDetails postData={postData} />
        </PostDetailsWrapper>
      )}
    </Wrapper>
  );
}

const Wrapper = styled(CenteredColumn)`
  width: 100%;
  height: 100%;
`;

const BackButton = styled.div`
  cursor: pointer;
  border: 1px solid #ccc;
  border-radius: 30px;
  padding: 10px 20px;
`;

const PostDetailsWrapper = styled.div`
  height: 100%;
  overflow-y: auto;
  padding: 0 40px;
  margin: 0 -40px;
`;

export default Post;
