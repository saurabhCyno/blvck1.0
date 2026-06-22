"use client";

import { useState } from "react";
import { adminUpdateReviewStatus, adminDeleteReview } from "@/app/actions";
import { ChevronDown, ChevronUp, Trash2, Check, X, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";

interface ReviewsClientProps {
  initialReviews: any[];
}

export default function ReviewsClient({ initialReviews }: ReviewsClientProps) {
  const router = useRouter();
  const [reviews, setReviews] = useState(initialReviews);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("All");

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Delete this review permanently?")) return;
    try {
      const response = await adminDeleteReview(id);
      if (response.success) {
        setReviews(reviews.filter((r) => r._id !== id));
        router.refresh();
      } else {
        alert("Failed to delete review.");
      }
    } catch {
      alert("Server error.");
    }
  };

  const handleStatusChange = async (id: string, status: "Approved" | "Rejected", e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await adminUpdateReviewStatus(id, status);
      if (response.success) {
        setReviews(
          reviews.map((r) => (r._id === id ? { ...r, status } : r))
        );
        router.refresh();
      } else {
        alert("Failed to update review status.");
      }
    } catch {
      alert("Server error.");
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredReviews = reviews.filter(
    (r) => filterStatus === "All" || r.status === filterStatus
  );

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Approved":
        return "border-green-500/20 bg-green-500/5 text-green-400";
      case "Rejected":
        return "border-red-500/20 bg-red-500/5 text-red-400";
      default:
        return "border-amber-500/20 bg-amber-500/5 text-amber-400";
    }
  };

  return (
    <div className="space-y-10 font-body">
      <div className="border-b border-white/10 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-black tracking-widest text-white uppercase">
            REVIEW MODERATION DECK
          </h1>
          <p className="text-white/45 text-xs mt-1">
            Approve or reject customer product reviews before they appear on the storefront.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <label htmlFor="review-filter" className="text-xs font-display tracking-widest text-white/50 uppercase">
            FILTER STATUS
          </label>
          <select
            id="review-filter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-black border border-white/10 px-3 py-1.5 text-xs text-white focus:outline-hidden"
          >
            <option value="All">ALL REVIEWS</option>
            <option value="Pending">PENDING</option>
            <option value="Approved">APPROVED</option>
            <option value="Rejected">REJECTED</option>
          </select>
        </div>
      </div>

      <div className="bg-black border border-white/10 overflow-hidden">
        {filteredReviews.length === 0 ? (
          <p className="text-xs text-white/45 py-12 text-center">No reviews match this filter.</p>
        ) : (
          <div className="divide-y divide-white/10">
            {filteredReviews.map((review) => {
              const isExpanded = expandedId === review._id;

              return (
                <div key={review._id} className="transition-all duration-300">
                  <div
                    onClick={() => toggleExpand(review._id)}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 gap-4 cursor-pointer hover:bg-white/5"
                  >
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
                        <span className={`border text-xs font-display font-black tracking-widest px-2 py-0.5 ${getStatusStyle(review.status)}`}>
                          {review.status.toUpperCase()}
                        </span>
                        <h3 className="font-display text-sm tracking-widest text-white truncate">
                          {review.userName}
                        </h3>
                      </div>
                      <div className="flex items-center space-x-3 text-xs text-white/45">
                        <span className="truncate max-w-[200px]">
                          {review.productId?.title || "DELETED PRODUCT"}
                        </span>
                        <span className="text-white/20">&bull;</span>
                        <div className="flex items-center space-x-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span
                              key={i}
                              className={`text-xs ${i < review.rating ? "text-white" : "text-white/20"}`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 w-full sm:w-auto justify-between sm:justify-end flex-shrink-0">
                      <span className="text-xs text-white/40">
                        {new Date(review.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <div className="flex items-center space-x-1">
                        {review.status === "Pending" && (
                          <>
                            <button
                              onClick={(e) => handleStatusChange(review._id, "Approved", e)}
                              className="p-1.5 text-green-400/60 hover:text-green-400 transition-colors"
                              title="Approve"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={(e) => handleStatusChange(review._id, "Rejected", e)}
                              className="p-1.5 text-red-400/60 hover:text-red-400 transition-colors"
                              title="Reject"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        {review.status === "Approved" && (
                          <button
                            onClick={(e) => handleStatusChange(review._id, "Rejected", e)}
                            className="p-1.5 text-red-400/60 hover:text-red-400 transition-colors"
                            title="Reject"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                        {review.status === "Rejected" && (
                          <button
                            onClick={(e) => handleStatusChange(review._id, "Approved", e)}
                            className="p-1.5 text-green-400/60 hover:text-green-400 transition-colors"
                            title="Approve"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                        )}
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4 text-white/40" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-white/40" />
                        )}
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="bg-card-light/40 border-t border-white/5 p-6 space-y-4 animate-fadeIn">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-white/60">
                        <div className="space-y-1">
                          <span className="text-[10px] font-display tracking-widest text-white/30 uppercase block">Product</span>
                          <span className="text-white">{review.productId?.title || "DELETED PRODUCT"}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] font-display tracking-widest text-white/30 uppercase block">Reviewed by</span>
                          <span className="text-white">{review.userName}</span>
                        </div>
                      </div>

                      <div className="bg-black border border-white/5 p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <h5 className="font-display text-xs tracking-widest text-white/40 uppercase">
                            REVIEW CONTENT
                          </h5>
                          <div className="flex items-center space-x-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span
                                key={i}
                                className={`text-sm ${i < review.rating ? "text-white" : "text-white/20"}`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-white/70 leading-relaxed whitespace-pre-wrap">
                          {review.comment}
                        </p>
                      </div>

                      <div className="flex justify-between items-center text-xs text-white/30">
                        <span className="flex items-center space-x-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{new Date(review.createdAt).toLocaleString("en-US")}</span>
                        </span>
                        <div className="flex items-center space-x-3">
                          {review.status === "Pending" ? (
                            <>
                              <button
                                onClick={(e) => handleStatusChange(review._id, "Approved", e)}
                                className="flex items-center space-x-1 text-green-400/60 hover:text-green-400 transition-colors uppercase font-display tracking-widest"
                              >
                                <Check className="h-3.5 w-3.5" />
                                <span>Approve</span>
                              </button>
                              <button
                                onClick={(e) => handleStatusChange(review._id, "Rejected", e)}
                                className="flex items-center space-x-1 text-red-400/60 hover:text-red-400 transition-colors uppercase font-display tracking-widest"
                              >
                                <X className="h-3.5 w-3.5" />
                                <span>Reject</span>
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={(e) => handleStatusChange(review._id, review.status === "Approved" ? "Rejected" : "Approved", e)}
                              className={`flex items-center space-x-1 uppercase font-display tracking-widest transition-colors ${
                                review.status === "Approved"
                                  ? "text-red-400/60 hover:text-red-400"
                                  : "text-green-400/60 hover:text-green-400"
                              }`}
                            >
                              {review.status === "Approved" ? (
                                <><X className="h-3.5 w-3.5" /><span>Reject</span></>
                              ) : (
                                <><Check className="h-3.5 w-3.5" /><span>Approve</span></>
                              )}
                            </button>
                          )}
                          <button
                            onClick={(e) => handleDelete(review._id, e)}
                            className="text-red-400/40 hover:text-red-400 transition-colors"
                            title="Delete review"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
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
