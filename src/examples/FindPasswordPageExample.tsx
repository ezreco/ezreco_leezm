/**
 * FindPasswordPage Usage Example
 *
 * This example demonstrates how to use the FindPasswordPage component
 * in conjunction with the LoginPage component.
 */

import { useState } from "react";
import LoginPage from "@/pages/LoginPage";
import FindPasswordPage from "@/pages/FindPasswordPage";

const FindPasswordPageExample: React.FC = () => {
  const [showLogin, setShowLogin] = useState(true);
  const [showFindPassword, setShowFindPassword] = useState(false);
  // const [showSignup, setShowSignup] = useState(false);

  // Login handlers
  const handleLoginClose = () => {
    setShowLogin(false);
  };

  const handleSignUpClick = () => {
    setShowLogin(false);
    // setShowSignup(true);
    // Navigate to signup page or open signup modal
  };

  const handleFindPasswordClick = () => {
    setShowLogin(false);
    setShowFindPassword(true);
  };

  const handleEmailSubmit = (email: string) => {
    console.log("Email submitted:", email);
    // Handle email submission (authentication logic)
  };

  // Find Password handlers
  const handleFindPasswordClose = () => {
    setShowFindPassword(false);
  };

  const handleBackToLogin = () => {
    setShowFindPassword(false);
    setShowLogin(true);
  };

  const handlePasswordResetEmailSubmit = (email: string) => {
    console.log("Password reset email sent to:", email);
    // Handle password reset email submission
    // This would typically call an API endpoint to send the reset email
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Example UI to trigger modals */}
      <div className="flex items-center justify-center min-h-screen gap-4">
        <button
          onClick={() => setShowLogin(true)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Open Login Modal
        </button>
        <button
          onClick={() => setShowFindPassword(true)}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Open Find Password Modal
        </button>
      </div>

      {/* Login Modal */}
      <LoginPage
        isOpen={showLogin}
        onClose={handleLoginClose}
        onSignUpClick={handleSignUpClick}
        onFindPasswordClick={handleFindPasswordClick}
        onEmailSubmit={handleEmailSubmit}
      />

      {/* Find Password Modal */}
      <FindPasswordPage
        isOpen={showFindPassword}
        onClose={handleFindPasswordClose}
        onBackToLogin={handleBackToLogin}
        onEmailSubmit={handlePasswordResetEmailSubmit}
      />
    </div>
  );
};

export default FindPasswordPageExample;
