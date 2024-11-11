import { CenteredColumn } from "../components/Flex";
import { Spacer } from "../components/Spacer";
import styled from "styled-components";
import { useNavigate } from "react-router-dom"; // navigate 추가

// @ts-ignore
import loginImage from "../assets/loginImage.png"
// @ts-ignore
import googleLoginButton from "../assets/google_login_button.png"
// @ts-ignore
import kakaoLoginButton from "../assets/kakao_login_button.png"
// @ts-ignore
import naverLoginButton from "../assets/naver_login_button.png"

function Login() {

  const URL = 'https://caring-sadly-marmoset.ngrok-free.app'

  const handleButtonClick = (provider) => {
    // 현재 페이지를 리디렉션할 URL로 사용하거나, 다른 원하는 URL을 사용
    const redirectUrl = encodeURIComponent(window.location.origin + '/'); 
    window.location.href = `${URL}/auth/login/${provider}?redirect_url=${redirectUrl}`;
  };

  return (
    <Wrapper>
      <Image src={loginImage} alt=" " style={{paddingLeft: "50px"}}/>
      <Spacer size={12} />
      <Header>찾을 수 있을 지도</Header>
      <Spacer size={12} />
      Lost n' Found Map
      <Spacer size={30} />
      <Button
        src={googleLoginButton}
        alt="구글 로그인 버튼"
        onClick={() => handleButtonClick('google')}
      />
      <Button
        src={kakaoLoginButton}
        alt="카카오 로그인 버튼"
        onClick={() => handleButtonClick('kakao')}
      />
      <Button
        src={naverLoginButton}
        alt="네이버 로그인 버튼"
        onClick={() => handleButtonClick('naver')}
      />
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

const Image = styled.img`
  max-width: 500px;
  height: 400px;
  margin-top: 0px; // Optional: Add margin for spacing
`;


const Button = styled.img`
  width: 350px; // 필요한 크기에 맞게 조정하세요
  height: auto; // 비율 유지
  cursor: pointer; // 클릭 가능한 상태 표시
  margin-top: 20px; // 원하는 경우 여백 추가
`;

export default Login;
