import { CenteredColumn } from "../components/Flex";
import { Spacer } from "../components/Spacer";
// @ts-ignore
import googleLoginButton from "../assets/google_login_button.png";
// @ts-ignore
import kakaoLoginButton from "../assets/kakao_login_button.png";
import { login } from "../api";
// @ts-ignore
import loginImage from "../assets/loginImage.png";
// @ts-ignore
import naverLoginButton from "../assets/naver_login_button.png";
import styled from "styled-components";

function Login() {
  return (
    <Wrapper>
      <Image src={loginImage} alt=" " />
      <Spacer size={12} />
      <Header>찾을 수 있을 지도</Header>
      Lost n&apos; Found Map
      <Spacer size={20} />
      <Button
        src={googleLoginButton}
        alt="구글 로그인 버튼"
        onClick={() => login("google")}
      />
      <Spacer size={12} />
      <Button
        src={kakaoLoginButton}
        alt="카카오 로그인 버튼"
        onClick={() => login("kakao")}
      />
      <Spacer size={12} />
      <Button
        src={naverLoginButton}
        alt="네이버 로그인 버튼"
        onClick={() => login("naver")}
      />
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

const Image = styled.img`
  height: 360px;
  margin-top: 0px; // Optional: Add margin for spacing
`;

const Button = styled.img`
  width: 300px; // 필요한 크기에 맞게 조정하세요
  height: auto; // 비율 유지
  cursor: pointer; // 클릭 가능한 상태 표시
`;

export default Login;
