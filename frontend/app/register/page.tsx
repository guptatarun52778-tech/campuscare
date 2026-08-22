"use client";

import Link from "next/link";
import { useState } from "react";

export default function Register() {
  const [anonymous, setAnonymous] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          studentId,
          password,
          anonymous,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data?.message || "Registration failed");
        return;
      }

      setMessage(data?.message || "Account created successfully!");

      setName("");
      setEmail("");
      setStudentId("");
      setPassword("");
      setAnonymous(false);
    } catch {
      setError("Server se connect nahi ho pa raha.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-950/95">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold">
              Campus<span className="text-blue-500">Care</span>
            </h1>

            <p className="text-xs text-slate-400">
              Digital Complaint Management System
            </p>
          </div>

          <Link
            href="/"
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium hover:bg-slate-800"
          >
            Home
          </Link>
        </div>
      </nav>

      {/* Register Form */}
      <section className="flex min-h-[calc(100vh-89px)] items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg">
          {/* Heading */}
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-400">
              🛡️ Join Campus Care
            </div>

            <h2 className="text-4xl font-bold">
              Create your account
            </h2>

            <p className="mt-3 text-slate-400">
              Register to submit and track your campus complaints.
            </p>
          </div>

          {/* Form Card */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
            <form onSubmit={handleRegister} className="space-y-5">
              
              {/* Full Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Full Name
                </label>

                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
                />
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
                />
              </div>

              {/* Student ID */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Student ID
                </label>

                <input
                  type="text"
                  placeholder="Enter your student ID"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
                />
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Password
                </label>

                <input
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
                />
              </div>

              {/* Anonymous Option */}
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={anonymous}
                    onChange={(e) => setAnonymous(e.target.checked)}
                    className="mt-1 h-4 w-4 accent-blue-600"
                  />

                  <div>
                    <p className="font-medium">
                      Enable anonymous complaints
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Your identity can be hidden when submitting a complaint.
                    </p>
                  </div>
                </label>
              </div>

              {/* Success Message */}
              {message && (
                <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-400">
                  {message}
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              {/* Register Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-blue-600 px-6 py-3 font-semibold shadow-lg shadow-blue-600/20 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            {/* Login Link */}
            <p className="mt-6 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-blue-500 hover:text-blue-400"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}