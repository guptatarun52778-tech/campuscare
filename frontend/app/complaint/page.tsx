"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Complaint() {
  const router = useRouter();

  const [category, setCategory] = useState("");
  const [complaint, setComplaint] = useState("");
  const [anonymous, setAnonymous] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setMessage("");
    setError("");

    const savedUser = localStorage.getItem("campusCareUser");

    if (!savedUser) {
      setError("Please login before submitting a complaint.");
      return;
    }

    const user = JSON.parse(savedUser);

    if (!category || !complaint.trim()) {
      setError("Please select a category and enter your complaint.");
      return;
    }
    const blockedWords = [
  "madarchod",
  "bhenchod",
  "chutiya",
  "gandu",
  "harami",
  "kamina",
  "fuck",
  "fucking",
  "shit",
  "bitch",
  "bhosdike",
  "randi",
  "randa",
  "bsdk",
  "bkl",
  "mc",
  "bc",
];

const containsAbusiveLanguage = blockedWords.some((word) =>
  complaint.toLowerCase().includes(word)
);

if (containsAbusiveLanguage) {
  setError(
    "Please use respectful language. Abusive or inappropriate language is not allowed."
  );
  return;
}

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/complaints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: anonymous ? null : user.name,
          email: anonymous ? null : user.email,
          category,
          is_anonymous: anonymous,
          complaint: complaint.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data?.message || "Failed to submit complaint.");
        return;
      }

      // Complaint successfully submitted
      const trackingId = `CC${data.complaintId}`;

      alert(
        `Complaint submitted successfully!\n\nYour Tracking ID is: ${trackingId}`
      );

      // Reset form
      setCategory("");
      setComplaint("");
      setAnonymous(false);

      // Go back to Student Dashboard
      router.push("/student-dashboard");
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

      {/* Complaint Section */}
      <section className="flex min-h-[calc(100vh-89px)] items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl">
          {/* Heading */}
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-400">
              📝 Submit Your Complaint
            </div>

            <h2 className="text-4xl font-bold">
              Tell us what happened
            </h2>

            <p className="mt-3 text-slate-400">
              Your complaint will be securely recorded and reviewed.
            </p>
          </div>

          {/* Form Card */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Category */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Complaint Category
                </label>

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                >
                  <option value="">Select a category</option>
                  <option value="Faculty">👨‍🏫 Faculty</option>
                  <option value="Classroom">🏫 Classroom</option>
                  <option value="Library">📚 Library</option>
                  <option value="Hostel">🏠 Hostel</option>
                  <option value="Canteen">🍽️ Canteen</option>
                  <option value="Transport">🚌 Transport</option>
                  <option value="Examination">📝 Examination</option>
                  <option value="Other">📌 Other</option>
                </select>
              </div>

              {/* Complaint */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Complaint Details
                </label>

                <textarea
                  value={complaint}
                  onChange={(e) => setComplaint(e.target.value)}
                  required
                  rows={7}
                  placeholder="Describe your complaint in detail..."
                  className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
                />

                <p className="mt-2 text-xs text-slate-500">
                  Please provide clear and relevant information.
                </p>
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
                      Submit anonymously
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Your name and email will be hidden from the complaint
                      record.
                    </p>
                  </div>
                </label>
              </div>

              {/* Success Message */}
              {message && (
                <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-400">
                  {message}
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-blue-600 px-6 py-3 font-semibold shadow-lg shadow-blue-600/20 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Submit Complaint"}
              </button>
            </form>

            {/* Back Home */}
            <div className="mt-6 text-center">
              <Link
                href="/"
                className="text-sm text-slate-500 hover:text-blue-400"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}