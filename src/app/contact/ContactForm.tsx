"use client";

import { useState } from "react";
import { createInquiry } from "../actions";
import { Send, CheckCircle2, AlertTriangle } from "lucide-react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    // Validation checks
    if (!formData.name.trim()) {
      setError("Name is required.");
      setLoading(false);
      return;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      setError("Please supply a valid email address.");
      setLoading(false);
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 8) {
      setError("Please supply a valid contact phone number.");
      setLoading(false);
      return;
    }
    if (!formData.message.trim()) {
      setError("Message content cannot be blank.");
      setLoading(false);
      return;
    }

    try {
      const result = await createInquiry({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        message: formData.message.trim(),
      });

      if (result.success) {
        setSuccess(true);
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        setError(result.error || "Failed to log inquiry. Please try again.");
      }
    } catch {
      setError("Server communications failure.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert Notifications */}
      {success && (
        <div className="bg-green-500/10 border border-green-500/30 text-green-400 p-4 text-xs font-body flex items-start space-x-3 animate-fadeIn">
          <CheckCircle2 className="h-4.5 w-4.5 text-green-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h5 className="font-display font-black tracking-widest text-white uppercase text-xs">
              SUBMISSION LOGGED
            </h5>
            <p className="text-xs text-white/50 leading-relaxed">
              We have saved your inquiry into the database. A concierge representative will review your message shortly.
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 text-xs font-body flex items-start space-x-3 animate-fadeIn">
          <AlertTriangle className="h-4.5 w-4.5 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h5 className="font-display font-black tracking-widest text-white uppercase text-xs">
              VALIDATION ERROR
            </h5>
            <p className="text-xs text-white/50 leading-relaxed">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div className="space-y-1.5">
          <label htmlFor="contact-name" className="block text-xs font-display tracking-widest text-white/50 uppercase">
            FULL NAME
          </label>
          <input
            id="contact-name"
            type="text"
            required
            placeholder="e.g. Liam Black"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-card-dark border border-white/10 px-4 py-3.5 text-xs font-body text-white focus:outline-hidden focus:border-white transition-colors"
          />
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label htmlFor="contact-email" className="block text-xs font-display tracking-widest text-white/50 uppercase">
            EMAIL ADDRESS
          </label>
          <input
            id="contact-email"
            type="email"
            required
            placeholder="e.g. liam@shadow.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full bg-card-dark border border-white/10 px-4 py-3.5 text-xs font-body text-white focus:outline-hidden focus:border-white transition-colors"
          />
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <label htmlFor="contact-phone" className="block text-xs font-display tracking-widest text-white/50 uppercase">
            TELEPHONE PHONE
          </label>
          <input
            id="contact-phone"
            type="tel"
            required
            placeholder="e.g. +91 99999 88888"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full bg-card-dark border border-white/10 px-4 py-3.5 text-xs font-body text-white focus:outline-hidden focus:border-white transition-colors"
          />
        </div>

        {/* Message */}
        <div className="space-y-1.5">
          <label htmlFor="contact-message" className="block text-xs font-display tracking-widest text-white/50 uppercase">
            INQUIRY DETAILS
          </label>
          <textarea
            id="contact-message"
            required
            rows={5}
            placeholder="Write your specifications, bulk order queries, or returns feedback here..."
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full bg-card-dark border border-white/10 px-4 py-3.5 text-xs font-body text-white focus:outline-hidden focus:border-white transition-colors resize-none"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-white text-black font-display font-black text-xs py-4.5 tracking-widest hover:bg-white/80 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2 cursor-pointer uppercase"
        >
          <span>{loading ? "DISPATCHING..." : "DISPATCH INQUIRY"}</span>
          {!loading && <Send className="h-3.5 w-3.5" />}
        </button>
      </form>
    </div>
  );
}
