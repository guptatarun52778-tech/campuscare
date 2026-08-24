"use client";

import Link from "next/link";
import { useState } from "react";

type Complaint = {
  id: number;
  category: string;
  is_anonymous: number;
  complaint: string;
  status: string;
  created_at: string;
};

export default function TrackComplaint() {
  const [complaintId, setComplaintId] = useState("");
  const [complaint, setComplaint] = useState<Complaint | null>(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setComplaint(null);

    const cleanId = complaintId.trim().toUpperCase();

    if (!cleanId) {
      setError("Please enter your Complaint ID.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:5000/api/complaints/${cleanId}`
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data?.message || "Complaint not found.");
        return;
      }

      setComplaint(data.complaint);
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

      {/* Track Section */}
      <section className="flex min-h-[calc(100vh-89px)] items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl">
          {/* Heading */}
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-400">
              🔎 Track Your Complaint
            </div>

            <h2 className="text-4xl font-bold">
              Check complaint status
            </h2>

            <p className="mt-3 text-slate-400">
              Enter your Complaint ID to see the latest status.
            </p>
          </div>

          {/* Search Card */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
            <form onSubmit={handleTrack} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Complaint ID
                </label>

                <input
                  type="text"
                  value={complaintId}
                  onChange={(e) => setComplaintId(e.target.value)}
                  placeholder="Example: CC3"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white uppercase outline-none placeholder:text-slate-600 focus:border-blue-500"
                />
              </div>

              {error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-blue-600 px-6 py-3 font-semibold shadow-lg shadow-blue-600/20 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Checking..." : "Track Complaint"}
              </button>
            </form>

            {/* Complaint Result */}
            {complaint && (
              <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950 p-6">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">
                      Complaint ID
                    </p>

                    <h3 className="mt-1 text-2xl font-bold text-blue-400">
                      CC{complaint.id}
                    </h3>
                  </div>

                  <span
                    className={`rounded-full px-4 py-2 text-sm ${
                      complaint.status === "Resolved"
                        ? "bg-green-500/10 text-green-400"
                        : complaint.status === "Under Review"
                        ? "bg-yellow-500/10 text-yellow-400"
                        : "bg-red-500/10 text-red-400"
                    }`}
                  >
                    {complaint.status}
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="rounded-xl border border-slate-800 p-4">
                    <p className="text-xs text-slate-500">
                      Category
                    </p>

                    <p className="mt-1 font-medium">
                      {complaint.category}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-800 p-4">
                    <p className="text-xs text-slate-500">
                      Complaint
                    </p>

                    <p className="mt-1 leading-7 text-slate-300">
                      {complaint.complaint}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-800 p-4">
                    <p className="text-xs text-slate-500">
                      Submitted On
                    </p>

                    <p className="mt-1 text-slate-300">
                      {new Date(complaint.created_at).toLocaleString()}
                    </p>
                  </div>

                  {complaint.is_anonymous === 1 && (
                    <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-4 text-sm text-blue-400">
                      🔒 This complaint was submitted anonymously.
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="mt-6 text-center">
              <Link
  href="/student-dashboard"
  className="text-sm text-slate-500 hover:text-blue-400"
>
  ← Back to Dashboard
</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}