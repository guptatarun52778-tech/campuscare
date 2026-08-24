"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Complaint = {
  id: number;
  name: string | null;
  email: string | null;
  category: string;
  is_anonymous: number;
  complaint: string;
  status: string;
  created_at: string;
};

export default function AdminDashboard() {
  const router = useRouter();

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    const admin = localStorage.getItem("campusCareAdmin");

    if (!admin) {
      router.push("/admin-login");
      return;
    }

    const loadComplaints = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "https://campuscare-jb23.onrender.com/api/admin/complaints"
        );

        const data = await response.json();

        if (!response.ok) {
          setError(data?.message || "Failed to load complaints.");
          return;
        }

        setComplaints(data.complaints || []);
      } catch {
        setError("Backend se connect nahi ho pa raha.");
      } finally {
        setLoading(false);
      }
    };

    loadComplaints();
  }, [router]);

  const updateStatus = async (id: number, status: string) => {
    try {
      const response = await fetch(
        `https://campuscare-jb23.onrender.com/api/admin/complaints/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data?.message || "Failed to update status.");
        return;
      }

      setComplaints((currentComplaints) =>
        currentComplaints.map((complaint) =>
          complaint.id === id
            ? { ...complaint, status }
            : complaint
        )
      );
    } catch {
      alert("Backend se connect nahi ho pa raha.");
    }
  };

  const getStatusClass = (status: string) => {
    if (status === "Resolved") {
      return "bg-green-500/10 text-green-400";
    }

    if (status === "Under Review") {
      return "bg-yellow-500/10 text-yellow-400";
    }

    return "bg-red-500/10 text-red-400";
  };

  // Apply filters
  const filteredComplaints = complaints.filter((complaint) => {
    const searchText = search.toLowerCase().trim();

    const matchesSearch =
      searchText === "" ||
      `CC${complaint.id}`.toLowerCase().includes(searchText) ||
      (complaint.name || "").toLowerCase().includes(searchText) ||
      (complaint.email || "").toLowerCase().includes(searchText) ||
      complaint.complaint.toLowerCase().includes(searchText);

    const matchesCategory =
      categoryFilter === "All" ||
      complaint.category === categoryFilter;

    const matchesStatus =
      statusFilter === "All" ||
      complaint.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const clearFilters = () => {
    setSearch("");
    setCategoryFilter("All");
    setStatusFilter("All");
  };

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
              Admin Complaint Management
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium hover:bg-slate-800"
            >
              Home
            </Link>

            <button
              onClick={() => {
                localStorage.removeItem("campusCareAdmin");
                router.push("/admin-login");
              }}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Dashboard */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        {/* Heading */}
        <div className="mb-8">
          <div className="mb-4 inline-flex rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-400">
            🛠️ Admin Panel
          </div>

          <h2 className="text-4xl font-bold">
            Complaint Dashboard
          </h2>

          <p className="mt-3 text-slate-400">
            View, filter and manage all student complaints.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">
              Total Complaints
            </p>

            <p className="mt-2 text-3xl font-bold">
              {complaints.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">
              Pending
            </p>

            <p className="mt-2 text-3xl font-bold text-red-400">
              {
                complaints.filter(
                  (complaint) => complaint.status === "Pending"
                ).length
              }
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">
              Resolved
            </p>

            <p className="mt-2 text-3xl font-bold text-green-400">
              {
                complaints.filter(
                  (complaint) => complaint.status === "Resolved"
                ).length
              }
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold">
                Filter Complaints
              </h3>

              <p className="text-sm text-slate-500">
                Search and filter complaints quickly.
              </p>
            </div>

            <button
              onClick={clearFilters}
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium hover:bg-slate-800"
            >
              Clear Filters
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {/* Search */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Search
              </label>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ID, name, email or complaint..."
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
              />
            </div>

            {/* Category */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Category
              </label>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
              >
                <option value="All">All Categories</option>
                <option value="Faculty">Faculty</option>
                <option value="Classroom">Classroom</option>
                <option value="Library">Library</option>
                <option value="Hostel">Hostel</option>
                <option value="Canteen">Canteen</option>
                <option value="Transport">Transport</option>
                <option value="Examination">Examination</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Status
              </label>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Under Review">Under Review</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          </div>

          {/* Filter Result Count */}
          <div className="mt-5 text-sm text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-300">
              {filteredComplaints.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-300">
              {complaints.length}
            </span>{" "}
            complaints
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center text-slate-400">
            Loading complaints...
          </div>
        ) : complaints.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center text-slate-400">
            No complaints found.
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center text-slate-400">
            No complaints match your filters.
          </div>
        ) : (
          /* Complaints */
          <div className="space-y-5">
            {filteredComplaints.map((complaint) => (
              <div
                key={complaint.id}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  {/* Complaint Info */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-bold text-blue-400">
                        CC{complaint.id}
                      </h3>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                          complaint.status
                        )}`}
                      >
                        {complaint.status}
                      </span>
                    </div>

                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-xs text-slate-500">
                          Student
                        </p>

                        <p className="mt-1 text-slate-300">
                          {complaint.is_anonymous
                            ? "Anonymous"
                            : complaint.name || "N/A"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500">
                          Category
                        </p>

                        <p className="mt-1 text-slate-300">
                          {complaint.category}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950 p-4">
                      <p className="text-xs text-slate-500">
                        Complaint
                      </p>

                      <p className="mt-2 leading-7 text-slate-300">
                        {complaint.complaint}
                      </p>
                    </div>

                    <p className="mt-4 text-xs text-slate-500">
                      Submitted:{" "}
                      {new Date(
                        complaint.created_at
                      ).toLocaleString()}
                    </p>
                  </div>

                  {/* Status Update */}
                  <div className="w-full lg:w-56">
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Update Status
                    </label>

                    <select
                      value={complaint.status}
                      onChange={(e) =>
                        updateStatus(
                          complaint.id,
                          e.target.value
                        )
                      }
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
                    >
                      <option value="Pending">
                        Pending
                      </option>

                      <option value="Under Review">
                        Under Review
                      </option>

                      <option value="Resolved">
                        Resolved
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}