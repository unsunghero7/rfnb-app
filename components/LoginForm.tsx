"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    console.log("Form submitted. Attempting to sign in...");

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      console.log("Sign in result:", result);

      if (result?.error) {
        console.error("Sign in error:", result.error);
        setError("Invalid email or password");
      } else if (result?.ok) {
        console.log("Sign-in successful, redirecting...");
        router.refresh(); // Refresh the current route
        router.push("/admin"); // Navigate to admin page
      } else {
        console.log("Unexpected result from signIn:", result);
        setError("An unexpected error occurred. Please try again.");
      }
    } catch (err) {
      console.error("Unexpected error during sign in:", err);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="text-red-500">{error}</div>}
      <div>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">Sign In</button>
    </form>
  );
};

export default LoginForm;
