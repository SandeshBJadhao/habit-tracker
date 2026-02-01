"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSignup(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    // ✅ user is already logged in
    window.location.href = "/habits";
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <form
        onSubmit={handleSignup}
        className="w-full max-w-sm bg-slate-800 p-6 rounded-xl space-y-4"
      >
        <h2 className="text-xl text-white font-semibold">
          Create Account
        </h2>

        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 rounded bg-slate-700 text-white"
        />

        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 rounded bg-slate-700 text-white"
        />

        {error && (
          <p className="text-sm text-red-400">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 text-white p-2 rounded"
        >
          {loading ? "Creating..." : "Create Account"}
        </button>

        <p className="text-sm text-slate-400 text-center">
          Already have an account?{" "}
          <a href="/login" className="text-emerald-400">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}