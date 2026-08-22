"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  id?: number;
  name?: string;
  email?: string;
};

export default function StudentDashboard() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [checkingLogin, setCheckingLogin] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("campusCareUser");

    if (!storedUser) {
      router.replace("/login");
      return;
    }

    try {
      const parsedUser: User = JSON.parse(storedUser);

      // Custom event ke through state update
      queueMicrotask(() => {
        setUser(parsedUser);
        setCheckingLogin(false);
      });
    } catch {
      localStorage.removeItem("campusCareUser");
      router.replace("/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("campusCareUser");
    router.replace("/login");
  };

  if (checkingLogin || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-slate-400">Loading dashboard...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-950/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold">
              Campus<span className="text-blue-500">Care</span>
            </h1>

            <p className="text-xs text-slate-400">
              Digital Complaint Management System
            </p>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-slate-400 sm:block">
              {user.name || user.email}
            </span>

            <button
              onClick={handleLogout}
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium hover:bg-slate-800"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Dashboard */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        {/* Welcome */}
        <div className="mb-10">
          <p className="mb-2 text-sm font-medium text-blue-500">
            STUDENT DASHBOARD
          </p>

          <h2 className="text-4xl font-bold">
            Welcome, {user.name || "Student"} 👋
          </h2>

          <p className="mt-3 text-slate-400">
            Manage your complaints and track their status from one place.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Submit Complaint */}
          <Link
            href="/complaint"
            className="group rounded-3xl border border-slate-800 bg-slate-900 p-7 transition hover:-translate-y-1 hover:border-blue-500/50 hover:bg-slate-900/80"
          >
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-3xl">
              📝
            </div>

            <h3 className="text-2xl font-bold group-hover:text-blue-400">
              Submit Complaint
            </h3>

            <p className="mt-3 text-slate-400">
              Submit a new complaint or report an issue related to your
              campus.
            </p>

            <div className="mt-6 text-sm font-semibold text-blue-500">
              Submit Complaint →
            </div>
          </Link>

          {/* Track Complaint */}
          <Link
            href="/track"
            className="group rounded-3xl border border-slate-800 bg-slate-900 p-7 transition hover:-translate-y-1 hover:border-green-500/50 hover:bg-slate-900/80"
          >
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500/10 text-3xl">
              🔍
            </div>

            <h3 className="text-2xl font-bold group-hover:text-green-400">
              Track Complaint
            </h3>

            <p className="mt-3 text-slate-400">
              Check the status of your submitted complaints and view updates.
            </p>

            <div className="mt-6 text-sm font-semibold text-green-500">
              Track Complaint →
            </div>
          </Link>
        </div>

        {/* Account Information */}
        <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900 p-7">
          <h3 className="text-xl font-bold">My Account</h3>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
              <p className="text-sm text-slate-500">Name</p>

              <p className="mt-1 font-medium">
                {user.name || "Not available"}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
              <p className="text-sm text-slate-500">Email</p>

              <p className="mt-1 break-all font-medium">
                {user.email || "Not available"}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}