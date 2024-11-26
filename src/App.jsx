import { Route, Routes, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Login from "./pages/Login";
import Main from "./pages/Main";
import MyPage from "./pages/MyPage";
import NotFound from "./pages/NotFound";
import Post from "./pages/Post";
import { Provider } from "react-redux";
import { checkLogin } from "./api";
import { createGlobalStyle } from "styled-components";
import mainPageStore from "./store";
import reset from "styled-reset";

const GlobalStyle = createGlobalStyle`
  ${reset};

  @import url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css");

  * {
    box-sizing: border-box;
  }

  #root {
    font-family: "Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif;
    line-height: 1.5;
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
        await checkLogin();
        setIsAuthenticated(true);
      } catch (error) {
        console.error("인증 확인 중 오류 발생:", error);
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
        <Route
          path="/"
          element={
            <Provider store={mainPageStore}>
              <Main />
            </Provider>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/my" element={<MyPage />} />
        <Route path="/post/:postId" element={<Post />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
