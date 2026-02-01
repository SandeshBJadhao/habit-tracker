"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginClient() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function login() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!error) router.push("/habits");
    else alert(error.message);
  }

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-header" />

        <input
          className="login-input"
          type="email"
          placeholder="Username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="login-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="login-btn" onClick={login}>
          LOGIN
        </button>

        <p className="forgot">Forgot password?</p>
      </div>

      {/* CSS INLINE – no file mess */}
      <style jsx>{`
        .login-wrapper {
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #6b7280, #9ca3af);
          font-family: sans-serif;
        }

        .login-card {
          width: 340px;
          background: #3f3f46;
          padding: 24px;
          border-radius: 6px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          text-align: center;
        }

        .login-header {
          height: 3px;
          background: #2dd4bf;
          margin-bottom: 24px;
          border-radius: 2px;
        }

        .login-input {
          width: 100%;
          padding: 12px;
          margin-bottom: 14px;
          border: none;
          outline: none;
          border-radius: 3px;
          font-size: 14px;
        }

        .login-btn {
          width: 100%;
          padding: 12px;
          background: #2dd4bf;
          color: white;
          border: none;
          border-radius: 3px;
          font-weight: bold;
          cursor: pointer;
          letter-spacing: 1px;
        }

        .login-btn:hover {
          background: #14b8a6;
        }

        .forgot {
          margin-top: 14px;
          font-size: 12px;
          color: #2dd4bf;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}