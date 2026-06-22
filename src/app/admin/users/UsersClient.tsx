"use client";

import { useState } from "react";
import { Download, Calendar, ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 15;

interface UsersClientProps {
  initialUsers: any[];
}

export default function UsersClient({ initialUsers }: UsersClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(initialUsers.length / PAGE_SIZE);
  const paginatedUsers = initialUsers.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );
  const exportCSV = () => {
    const headers = ["Name", "Email", "Phone", "Joined Date"];
    const rows = initialUsers.map((u) => [
      u.name,
      u.email,
      u.phone,
      new Date(u.createdAt).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `blvck-core-users-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-10 font-body">
      <div className="border-b border-white/10 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-black tracking-widest text-white uppercase">
            USER DIRECTORY
          </h1>
          <p className="text-white/45 text-xs mt-1">
            All registered users — {initialUsers.length} total
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="flex items-center space-x-2 border border-white/20 px-4 py-2.5 text-xs font-display tracking-widest hover:border-white transition-colors uppercase"
        >
          <Download className="h-4 w-4" />
          <span>EXPORT CSV</span>
        </button>
      </div>

      {initialUsers.length === 0 ? (
        <div className="py-24 text-center border border-white/5 bg-card-dark flex flex-col items-center justify-center space-y-4">
          <p className="font-display text-white/40 text-sm tracking-widest uppercase">
            NO REGISTERED USERS YET.
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-white/40 font-display tracking-widest uppercase">
                  <th className="pb-3 pr-4 font-medium">#</th>
                  <th className="pb-3 pr-4 font-medium">NAME</th>
                  <th className="pb-3 pr-4 font-medium">EMAIL</th>
                  <th className="pb-3 pr-4 font-medium">PHONE</th>
                  <th className="pb-3 pr-4 font-medium">
                    <span className="flex items-center space-x-1.5">
                      <Calendar className="h-3 w-3" />
                      <span>JOINED</span>
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user, idx) => (
                  <tr
                    key={user._id}
                    className="border-b border-white/5 text-white/80 hover:bg-white/5 transition-colors"
                  >
                    <td className="py-3.5 pr-4 text-white/30 font-mono">
                      {(currentPage - 1) * PAGE_SIZE + idx + 1}
                    </td>
                    <td className="py-3.5 pr-4 font-medium">{user.name}</td>
                    <td className="py-3.5 pr-4 text-white/60">{user.email}</td>
                    <td className="py-3.5 pr-4 text-white/60">{user.phone}</td>
                    <td className="py-3.5 pr-4 text-white/50 whitespace-nowrap">
                      {new Date(user.createdAt).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 pt-6 border-t border-white/5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="h-8 w-8 flex items-center justify-center border border-white/10 text-white/40 hover:text-white hover:border-white/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`h-8 w-8 text-xs font-display flex items-center justify-center border transition-all ${
                    currentPage === p
                      ? "border-white bg-white text-black font-black"
                      : "border-white/10 text-white/40 hover:border-white/30"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="h-8 w-8 flex items-center justify-center border border-white/10 text-white/40 hover:text-white hover:border-white/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
