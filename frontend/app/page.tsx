"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-950/95">
        <div className="mx-auto flex max-w-6xl items-center justify-center px-6 py-5">
          <div className="text-center">
            <h1 className="text-3xl font-bold">
              Campus<span className="text-blue-500">Care</span>
            </h1>

            <p className="mt-1 text-xs text-slate-400">
              Digital Complaint Management System
            </p>
          </div>
        </div>
      </nav>

      {/* Login Selection */}
      <section className="flex min-h-[calc(100vh-89px)] items-center justify-center px-6 py-12">
        <div className="w-full max-w-4xl">
          {/* Heading */}
          <div className="mb-12 text-center">
            <div className="mb-5 inline-flex rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-400">
              🛡️ Safe • Simple • Student Friendly
            </div>

            <h2 className="text-4xl font-bold md:text-5xl">
              Welcome to Campus Care
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-400">
              Choose your account type to continue to the Campus Care
              complaint management system.
            </p>
          </div>

          {/* Login Cards */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Student Login */}
            <Link
              href="/login"
              className="group rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl transition hover:-translate-y-1 hover:border-blue-500 hover:bg-slate-900/80"
            >
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-4xl">
                👨‍🎓
              </div>

              <h3 className="text-2xl font-bold">
                Student Login
              </h3>

              <p className="mt-3 leading-7 text-slate-400">
                Login as a student to submit complaints, track complaint
                status and manage your account.
              </p>

              <div className="mt-8 inline-flex rounded-xl bg-blue-600 px-5 py-3 font-semibold transition group-hover:bg-blue-700">
                Continue as Student →
              </div>
            </Link>

            {/* Admin Login */}
            <Link
              href="/admin-login"
              className="group rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl transition hover:-translate-y-1 hover:border-purple-500 hover:bg-slate-900/80"
            >
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-500/10 text-4xl">
                🛠️
              </div>

              <h3 className="text-2xl font-bold">
                Admin Login
              </h3>

              <p className="mt-3 leading-7 text-slate-400">
                Login as an administrator to view, manage and update
                student complaints.
              </p>

              <div className="mt-8 inline-flex rounded-xl bg-purple-600 px-5 py-3 font-semibold transition group-hover:bg-purple-700">
                Continue as Admin →
              </div>
            </Link>
          </div>

          {/* Bottom Note */}
          <div className="mt-10 text-center">
            <p className="text-sm text-slate-500">
              Campus Care — A better way to raise your campus concerns.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}