import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

export default function Login({ onLoginSuccess }) {
  const navigate = useNavigate();
  const location = useLocation();
  const shouldShowMemberNotice = location.state?.reason === "member_required";

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tokenId: credentialResponse.credential }),
      });

      const data = await res.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        if (onLoginSuccess) onLoginSuccess(data.user);
        navigate("/rooms");
      } else {
        alert("Login failed");
      }
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {shouldShowMemberNotice && (
        <div className="mb-3 rounded-md border border-yellow-300 bg-yellow-50 px-3 py-2 text-sm text-yellow-900">
          You need to be a member to reserve a room. Please log in or create an
          account.
        </div>
      )}
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() => alert("Google login failed")}
      />
    </div>
  );
}
