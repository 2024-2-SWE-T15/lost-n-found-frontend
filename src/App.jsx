import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";

import Login from "./pages/Login";
import Main from "./pages/Main";
import MyPage from "./pages/MyPage";
import NotFound from "./pages/NotFound";
import Post from "./pages/Post";
import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

const GlobalStyle = createGlobalStyle`
  ${reset};

  * {
    box-sizing: border-box;
  }

  #root {
    background-color: white;
    color: #1e1e1e;
    width: 100vw;
    height: 100vh;
    min-width: 800px;
    min-height: 600px;
  }
`;

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await fetch('https://caring-sadly-marmoset.ngrok-free.app/auth/verification', {
          method: 'GET',
          credentials: 'include', // 쿠키나 인증 토큰이 필요한 경우
        });

        if (response.status === 200) {
          // console.log('인증 성공: 사용자가 인증되었습니다.');
          setIsAuthenticated(true);
        } else {
          console.log('인증 실패: 응답 코드', response.status);
          setIsAuthenticated(false);
          navigate("/login");
        }
      } catch (error) {
        console.error('인증 확인 중 오류 발생:', error);
        setIsAuthenticated(false);
        navigate("/login");
      }
    };

    verifyAuth();
  }, [navigate]);

  if (isAuthenticated === null) {
    // 로딩 중 상태 표시
    return <div>로딩 중...</div>;
  }

  return (
    <>
      <GlobalStyle />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<Login />} />
        <Route path="/my" element={<MyPage />} />
        <Route path="/post/:postId" element={<Post />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;