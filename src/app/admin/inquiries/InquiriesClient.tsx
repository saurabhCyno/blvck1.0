"use client";

import { useState } from "react";
import { adminToggleInquiryStatus } from "@/app/actions";
import { Inbox, Eye, EyeOff, Calendar, User, Phone, Mail, ChevronDown, ChevronUp } from "lucide-react";
import { useRouter } from "next/navigation";

interface InquiriesClientProps {
  initialInquiries: any[];
}

export default function InquiriesClient({ initialInquiries }: InquiriesClientProps) {
  const router = useRouter();
  const [inquiries, setInquiries] = useState(initialInquiries);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterReadStatus, setFilterReadStatus] = useState<string>("All");

  const handleToggleStatus = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid expanding/collapsing row when clicking button
    try {
      const response = await adminToggleInquiryStatus(id);
      if (response.success && response.status) {
        setInquiries(
          inquiries.map((inq) => (inq._id === id ? { ...inq, status: response.status } : inq))
        );
        router.refresh();
      } else {
        alert("Failed to update status.");
      }
    } catch {
      alert("Server communications error.");
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredInquiries = inquiries.filter(
    (inq) => filterReadStatus === "All" || inq.status === filterReadStatus
  );

  return (
    <div className="space-y-10 font-body">
      {/* Workspace Header */}
      <div className="border-b border-white/10 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-black tracking-widest text-white uppercase">
            INQUIRY LOGGING STREAM
          </h1>
          <p className="text-white/45 text-xs mt-1">
            Track user submissions and contact form requests.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex items-center space-x-2">
          <label htmlFor="inquiry-filter" className="text-xs font-display tracking-widest text-white/50 uppercase">
            FILTER READ STATUS
          </label>
          <select
            id="inquiry-filter"
            value={filterReadStatus}
            onChange={(e) => setFilterReadStatus(e.target.value)}
            className="bg-black border border-white/10 px-3 py-1.5 text-xs text-white focus:outline-hidden"
          >
            <option value="All">ALL SUBMISSIONS</option>
            <option value="Unread">UNREAD</option>
            <option value="Read">READ</option>
          </select>
        </div>
      </div>

      {/* Directory list */}
      <div className="bg-black border border-white/10 overflow-hidden">
        {filteredInquiries.length === 0 ? (
          <p className="text-xs text-white/45 py-12 text-center">No inquiry logs match this status.</p>
        ) : (
          <div className="divide-y divide-white/10">
            {filteredInquiries.map((inq) => {
              const isExpanded = expandedId === inq._id;
              const isUnread = inq.status === "Unread";

              return (
                <div key={inq._id} className="transition-all duration-300">
                  {/* Row Summary */}
                  <div
                    onClick={() => toggleExpand(inq._id)}
                    className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 gap-4 cursor-pointer hover:bg-white/5 ${
                      isUnread ? "bg-white/[0.02]" : ""
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-3">
                        <span className={`font-display text-xs font-black tracking-widest px-2.5 py-0.5 border ${
                          isUnread
                            ? "border-red-500/20 bg-red-500/5 text-red-400"
                            : "border-white/10 bg-black text-white/40"
                        }`}>
                          {inq.status.toUpperCase()}
                        </span>
                        <h3 className={`font-display text-sm tracking-widest ${isUnread ? "text-white font-bold" : "text-white/70"}`}>
                          {inq.name}
                        </h3>
                      </div>
                      <p className="text-xs text-white/45">
                        {inq.email} &bull; {inq.phone}
                      </p>
                    </div>

                    <div className="flex items-center space-x-4 w-full sm:w-auto justify-between sm:justify-end">
                      <span className="text-xs font-body text-white/40 uppercase">
                        {new Date(inq.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>

                      <div className="flex items-center space-x-2">
                        {/* Quick Mark Read/Unread */}
                        <button
                          onClick={(e) => handleToggleStatus(inq._id, e)}
                          className="p-1 text-white/40 hover:text-white transition-colors"
                          title={isUnread ? "Mark as Read" : "Mark as Unread"}
                        >
                          {isUnread ? <Eye className="h-4.5 w-4.5" /> : <EyeOff className="h-4.5 w-4.5" />}
                        </button>
                        
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4 text-white/40" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-white/40" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded detail */}
                  {isExpanded && (
                    <div className="bg-card-light/40 border-t border-white/5 p-6 space-y-4 animate-fadeIn">
                      {/* Meta grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-white/60 font-body">
                        <div className="flex items-center space-x-2">
                          <User className="h-3.5 w-3.5 text-white/30" />
                          <span className="text-white">{inq.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Mail className="h-3.5 w-3.5 text-white/30" />
                          <span>{inq.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-3.5 w-3.5 text-white/30" />
                          <span>{inq.phone}</span>
                        </div>
                      </div>

                      {/* Message Content */}
                      <div className="bg-black border border-white/5 p-4 space-y-2">
                        <h5 className="font-display text-xs tracking-widest text-white/40">
                          MESSAGE CONTENT
                        </h5>
                        <p className="text-xs text-white/70 leading-relaxed font-body whitespace-pre-wrap">
                          {inq.message}
                        </p>
                      </div>

                      {/* Info and timestamp */}
                      <div className="flex justify-between items-center text-xs text-white/30">
                        <span>
                          LOGGED AT: {new Date(inq.createdAt).toLocaleString("en-US")}
                        </span>
                        <button
                          onClick={(e) => handleToggleStatus(inq._id, e)}
                          className="hover:text-white transition-colors uppercase font-display tracking-widest"
                        >
                          MARK AS {isUnread ? "READ" : "UNREAD"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
