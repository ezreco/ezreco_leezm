"use client";

import { useState, useEffect } from "react";
import icLogoRound from "@/assets/icons/ic_logo_round.png";
import icShow from "@/assets/icons/ic_show.png";

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
interface LoginPageProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSignUpClick?: () => void;
  onFindPasswordClick?: () => void;
  onGoogleLogin?: () => void;
  onEmailSubmit?: (email: string) => void;
}

interface InputFieldProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: () => void;
  type?: "email" | "text" | "password";
}

// =============================================================================
// UI COMPONENTS
// =============================================================================

/**
 * Input Field with Submit Button
 */
const EmailInputField: React.FC<InputFieldProps> = ({
  placeholder = "이메일 주소",
  value = "",
  onChange,
  onSubmit,
  type = "email",
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [showPassword, setShowPassword] = useState(false);

  // Email validation regex
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange?.(newValue);
  };

  const handleSubmit = () => {
    if (type === "password") {
      // For password field, just check if there's a value
      if (inputValue.trim()) {
        onSubmit?.();
      }
    } else {
      // For email field, validate email format
      if (inputValue.trim() && isValidEmail(inputValue)) {
        onSubmit?.();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (type === "password" && inputValue.trim()) {
        handleSubmit();
      } else if (isValidEmail(inputValue)) {
        handleSubmit();
      }
    }
  };

  // Check if submit button should be shown
  const shouldShowSubmitButton =
    type === "password"
      ? inputValue.trim() !== ""
      : inputValue.trim() !== "" && isValidEmail(inputValue);

  // Determine actual input type (for password visibility toggle)
  const actualInputType = type === "password" && showPassword ? "text" : type;

  return (
    <div className="relative w-[534px]">
      <input
        type={actualInputType}
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-[468px] h-[62px] px-[32px] border-0  bg-[#F8F8FA] rounded-full   transition-all text-[16px] bg-white placeholder:text-[#989BA2]"
      />

      {/* Password visibility toggle button */}
      {type === "password" && inputValue.trim() && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-[72px] top-1/2 transform -translate-y-1/2 w-[24px] h-[24px] flex items-center justify-center hover:opacity-70 transition-opacity"
          aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
        >
          <img src={icShow} alt="show password" className="w-[19px] h-[19px]" />
        </button>
      )}

      {/* Submit button */}
      {shouldShowSubmitButton && (
        <button
          onClick={handleSubmit}
          className="absolute right-[12px] top-1/2 transform -translate-y-1/2 w-[48px] h-[48px] bg-[#0106FF] rounded-full flex items-center justify-center text-white hover:opacity-90 transition-all duration-200"
          aria-label="이메일 제출"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 12h14m-7-7l7 7-7 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

/**
 * Google Login Button
 */
const GoogleButton: React.FC<{ onClick?: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="w-[534px] h-[66px] flex items-center justify-center gap-[16px] rounded-full bg-[#F8F8FA] hover:bg-[#EDEDF1] active:bg-[#E5E5EB] transition-colors"
  >
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
    <span className="text-[16px] font-semibold text-gray-100">
      Google로 계속하기
    </span>
  </button>
);

// =============================================================================
// MAIN LOGIN PAGE COMPONENT
// =============================================================================

const LoginPage: React.FC<LoginPageProps> = ({
  isOpen = true,
  onClose,
  onSignUpClick,
  onFindPasswordClick,
  onEmailSubmit,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailSubmit = () => {
    if (email.trim()) {
      onEmailSubmit?.(email);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://43.200.32.71:3001/api/auth/google/login";
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose?.();
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      {/* Login Modal */}
      <div className="bg-white rounded-[20px] w-[900px] h-[840px] relative shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-[40px] right-[40px] w-[48px] h-[48px] flex items-center justify-center "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
          >
            <path
              d="M18 1.38184L10.3818 9L18 16.6182L16.6182 18L9 10.3818L1.38184 18L0 16.6182L7.61816 9L0 1.38184L1.38184 0L9 7.61816L16.6182 0L18 1.38184Z"
              fill="black"
            />
          </svg>{" "}
        </button>

        {/* Main Content */}
        <div className="flex flex-col items-center pt-[138px]">
          {/* Logo */}
          <div className="">
            <img
              src={icLogoRound}
              alt="EZReco Logo"
              className="w-[62px] h-[62px] rounded-full"
            />
          </div>

          {/* Welcome Message */}
          <h1 className="h-[52px] text-[42px] font-semibold text-gray-100 text-center  mt-[36px] mb-[0px]">
            EZReco에 오신 걸 환영해요.
          </h1>

          {/* Login Forms */}
          <div className="w-[534px] flex flex-col gap-[14px] mt-[68px]">
            {/* Google Login */}
            <GoogleButton onClick={handleGoogleLogin} />

            {/* Divider with "또는" */}
            <div className="flex items-center gap-[37px]">
              <div className="flex-1 h-[1px] bg-[#D5D8DC]"></div>
              <span className="text-[14px] text-[#989BA2]">또는</span>
              <div className="flex-1 h-[1px] bg-[#D5D8DC]"></div>
            </div>

            {/* Email Input */}
            <EmailInputField
              value={email}
              onChange={setEmail}
              onSubmit={handleEmailSubmit}
              placeholder="이메일 주소"
            />

            {/* Password Input */}
            <EmailInputField
              value={password}
              onChange={setPassword}
              onSubmit={handleEmailSubmit}
              type="password"
              placeholder="비밀번호"
            />
          </div>

          {/* Forgot Password & Sign Up Links */}
          <div className="text-center mt-[16px] flex flex-col gap-[8px]">
            <div>
              <span className="text-[14px] text-[#989BA2]">
                이메일 또는 비밀번호를 잊으셨나요?{" "}
              </span>
              <button
                onClick={onFindPasswordClick}
                className="text-[#0106FF] text-[14px] font-normal underline transition-colors hover:opacity-80"
              >
                비밀번호 찾기
              </button>
            </div>
            <div>
              <span className="text-[14px] text-[#989BA2]">
                계정이 없으신가요?{" "}
              </span>
              <button
                onClick={onSignUpClick}
                className="text-[#0106FF] text-[14px] font-normal underline transition-colors"
              >
                회원가입
              </button>
            </div>
          </div>

          {/* Footer Links */}
          {/* Terms & Privacy */}
          <div className="mt-[93px] flex items-center justify-center gap-[10px] text-[14px] text-[#989BA2]">
            <button className="text-[14px] font-normal ">이용약관</button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="2"
              height="10"
              viewBox="0 0 2 10"
              fill="none"
            >
              <rect x="0.5" width="1" height="10" fill="#D5D8DC" />
            </svg>
            <button className="text-[14px] font-normal">
              개인정보 보호 정책
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
