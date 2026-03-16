import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import SmartRecommendPage from "./pages/SmartRecommendPage";
import InferenceTestPage from "./pages/InferenceTestPage";
import VoiceChatPage from "./pages/VoiceChatPage";
import PersonaDiscussionResultPage from "./pages/PersonaDiscussionResultPage";
import TournamentPage from "./pages/TournamentPage";
import TournamentResultPage from "./pages/TournamentResultPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import FindPasswordPage from "./pages/FindPasswordPage";
import EZWikiPage from "./pages/EZWikiPage";
import EZWikiDetailPage from "./pages/EZWikiDetailPage";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { SidePanelProvider } from "./contexts/SidePanelContext";

// Main App Content Component
function AppContent() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isFindPasswordOpen, setIsFindPasswordOpen] = useState(false);

  // Get auth functions
  const { login, loginWithGoogle } = useAuth();

  const handleOpenLogin = () => {
    console.log("로그인 모달 열기 클릭 - 현재 상태:", isLoginOpen);
    setIsLoginOpen(true);
    setIsSignupOpen(false);
    console.log("로그인 모달 상태 변경됨 - 새 상태:", true);
  };

  const handleCloseLogin = () => {
    setIsLoginOpen(false);
  };

  const handleOpenSignup = () => {
    console.log("회원가입 모달 열기");
    setIsSignupOpen(true);
    setIsLoginOpen(false);
  };

  const handleCloseSignup = () => {
    setIsSignupOpen(false);
  };

  const handleGoogleLogin = async () => {
    try {
      console.log("Google 로그인 처리");
      await loginWithGoogle();
      setIsLoginOpen(false);
      setIsSignupOpen(false);
    } catch (error) {
      console.error("Google 로그인 실패:", error);
    }
  };

  // const handleGoogleSignup = async () => {
  //   try {
  //     console.log("Google 회원가입 처리");
  //     await loginWithGoogle(); // Same as login for Google
  //     setIsSignupOpen(false);
  //     setIsLoginOpen(false);
  //   } catch (error) {
  //     console.error("Google 회원가입 실패:", error);
  //   }
  // };

  const handleEmailSubmit = async (email: string) => {
    try {
      console.log("이메일 로그인:", email);
      await login(email);
      setIsLoginOpen(false);
    } catch (error) {
      console.error("이메일 로그인 실패:", error);
    }
  };

  const handleSignupSubmit = async (email: string, phoneNumber: string, password: string) => {
    try {
      console.log("회원가입 데이터 - 이메일:", email, "전화번호:", phoneNumber, "비밀번호:", password);
      await login(email); // For now, signup is same as login
      setIsSignupOpen(false);
    } catch (error) {
      console.error("회원가입 실패:", error);
    }
  };

  const handleSignUpClick = () => {
    console.log("회원가입 클릭");
    handleOpenSignup();
  };

  const handleLoginClick = () => {
    console.log("로그인 클릭");
    handleOpenLogin();
  };

  const handleFindPasswordClick = () => {
    console.log("비밀번호 찾기 클릭");
    setIsLoginOpen(false);
    setIsFindPasswordOpen(true);
  };

  const handleCloseFindPassword = () => {
    setIsFindPasswordOpen(false);
  };

  const handleBackToLogin = () => {
    console.log("로그인으로 돌아가기");
    setIsFindPasswordOpen(false);
    setIsLoginOpen(true);
  };

  const handleFindPasswordSubmit = async (email: string, phoneNumber: string) => {
    try {
      console.log("비밀번호 찾기 - 이메일:", email, "전화번호:", phoneNumber);
      // TODO: 비밀번호 재설정 API 호출
      // await resetPassword(email, phoneNumber);
    } catch (error) {
      console.error("비밀번호 찾기 실패:", error);
    }
  };

  return (
    <>
      {/* 레이아웃 (Sidebar + 메인 콘텐츠) */}
      <Layout onLoginClick={handleOpenLogin}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/smart-recommend" element={<SmartRecommendPage />} />
          <Route path="/inference-test" element={<InferenceTestPage />} />
          <Route path="/voice-chat" element={<VoiceChatPage />} />
          <Route path="/persona-discussion-result" element={<PersonaDiscussionResultPage />} />
          <Route path="/tournament" element={<TournamentPage />} />
          <Route path="/tournament-result" element={<TournamentResultPage />} />
          <Route path="/ezwiki" element={<EZWikiPage />} />
          <Route path="/ezwiki/:modelId" element={<EZWikiDetailPage />} />
        </Routes>
      </Layout>

      {/* 로그인 모달 오버레이 */}
      <LoginPage
        isOpen={isLoginOpen}
        onClose={handleCloseLogin}
        onGoogleLogin={handleGoogleLogin}
        onEmailSubmit={handleEmailSubmit}
        onSignUpClick={handleSignUpClick}
        onFindPasswordClick={handleFindPasswordClick}
      />

      {/* 회원가입 모달 오버레이 */}
      <SignupPage
        isOpen={isSignupOpen}
        onClose={handleCloseSignup}
        onLoginClick={handleLoginClick}
        onSignupSubmit={handleSignupSubmit}
      />

      {/* 비밀번호 찾기 모달 오버레이 */}
      <FindPasswordPage
        isOpen={isFindPasswordOpen}
        onClose={handleCloseFindPassword}
        onBackToLogin={handleBackToLogin}
        onEmailSubmit={handleFindPasswordSubmit}
      />
    </>
  );
}

// Main App Component with AuthProvider
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SidePanelProvider>
          <AppContent />
        </SidePanelProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
