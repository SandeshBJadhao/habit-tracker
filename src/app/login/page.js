"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // success → habits page
    window.location.href = "/habits";
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="w-full max-w-sm bg-slate-800/80 backdrop-blur rounded-xl p-6 shadow-lg">
        
        <h2 className="text-2xl font-semibold text-white text-center">
          Welcome Back 👋
        </h2>

        <p className="text-sm text-slate-300 text-center mt-1 mb-6">
          Sign in to continue tracking your habits
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 rounded bg-slate-700 text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 rounded bg-slate-700 text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-emerald-500"
          />

          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded font-medium transition"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-xs text-slate-400 text-center mt-4">
          Stay consistent. Small habits, big results.
        </p>
        <p className="text-sm text-slate-400 text-center mt-4">
  Don’t have an account?{" "}
  <a
    href="/signup"
    className="text-emerald-400 hover:underline"
  >
    Create one
  </a>
</p>
      </div>
    </div>
  );
}