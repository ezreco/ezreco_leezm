"use client";

import { useState, useEffect } from "react";
import icLogoRound from "@/assets/icons/ic_logo_round.png";

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
interface FindPasswordPageProps {
  isOpen?: boolean;
  onClose?: () => void;
  onBackToLogin?: () => void;
  onEmailSubmit?: (email: string, phoneNumber: string) => void;
}

interface InputFieldProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  type?: "email" | "tel" | "text";
}

// =============================================================================
// UI COMPONENTS
// =============================================================================

/**
 * Input Field Component (Figma style)
 */
const InputField: React.FC<InputFieldProps> = ({
  placeholder = "",
  value = "",
  onChange,
  type = "text",
}) => {
  const [inputValue, setInputValue] = useState(value);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange?.(newValue);
  };

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  return (
    <div className="relative w-[500px] h-[66px]">
      <div className="absolute inset-0 bg-[#F8F8FA] rounded-full" />
      <input
        type={type}
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="absolute left-[24px] right-[24px] top-[20px] h-[26px] bg-transparent border-0 outline-none text-[16px] text-[#252525] placeholder:text-[#989BA2] leading-[26px]"
      />
    </div>
  );
};

// =============================================================================
// MAIN FIND PASSWORD PAGE COMPONENT
// =============================================================================

const FindPasswordPage: React.FC<FindPasswordPageProps> = ({
  isOpen = true,
  onClose,
  onBackToLogin,
  onEmailSubmit,
}) => {
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSubmit = () => {
    if (email.trim() || phoneNumber.trim()) {
      onEmailSubmit?.(email, phoneNumber);
    }
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

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setEmail("");
      setPhoneNumber("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      {/* Find Password Modal */}
      <div className="bg-white rounded-[20px] w-[900px] h-[840px] relative shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-[40px] right-[40px] w-[32px] h-[32px] flex items-center justify-center hover:opacity-70 transition-opacity"
          aria-label="닫기"
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
          </svg>
        </button>

        {/* Main Content */}
        <div className="flex flex-col items-center pt-[138px]">
          {/* Logo */}
          <div className="w-[62px] h-[62px]">
            <img
              src={icLogoRound}
              alt="EZReco Logo"
              className="w-full h-full rounded-full"
            />
          </div>

          {/* Title */}
          <h1 className="text-[42px] font-semibold text-[#252525] text-center mt-[36px] leading-[52px]">
            비밀밀호 찾기
          </h1>

          {/* Input Fields */}
          <div className="flex flex-col gap-[14px] mt-[68px]">
            {/* Email Input */}
            <InputField
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="Email"
            />

            {/* Phone Number Input */}
            <InputField
              type="tel"
              value={phoneNumber}
              onChange={setPhoneNumber}
              placeholder="Phone Number"
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-[500px] h-[66px] bg-[#252525] rounded-full text-white text-[16px] font-semibold mt-[80px] hover:opacity-90 transition-opacity leading-[26px]"
          >
            비밀번호 찾기
          </button>

          {/* Back to Login Link */}
          <div className="flex items-center gap-[8px] mt-[20px]">
            <span className="text-[14px] text-[#989BA2] leading-[20px]">
              이미 계정이 있으신가요?
            </span>
            <button
              onClick={onBackToLogin}
              className="text-[#0106FF] text-[14px] font-normal underline transition-colors hover:opacity-80 leading-[10px]"
            >
              로그인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindPasswordPage;
