"use client";

import { useState } from "react";
import { adminSaveSetting } from "@/app/actions";
import { Save, AlertCircle, CheckCircle, Info, Share2, PhoneCall } from "lucide-react";
import { useRouter } from "next/navigation";

interface SettingsClientProps {
  aboutCMS: any;
  socialsCMS: any;
  contactsCMS: any;
}

export default function SettingsClient({
  aboutCMS,
  socialsCMS,
  contactsCMS,
}: SettingsClientProps) {
  const router = useRouter();
  
  // Status hooks
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState<string | null>(null);

  // About CMS State
  const [aboutState, setAboutState] = useState({
    manifesto: aboutCMS?.manifesto || "",
    history: aboutCMS?.history || "",
    team: aboutCMS?.team || [
      { name: "", role: "" },
      { name: "", role: "" },
      { name: "", role: "" },
    ],
  });

  // Socials CMS State
  const [socialsState, setSocialsState] = useState({
    instagram: socialsCMS?.instagram || "",
    twitter: socialsCMS?.twitter || "",
    youtube: socialsCMS?.youtube || "",
  });

  // Contacts CMS State
  const [contactsState, setContactsState] = useState({
    phone: contactsCMS?.phone || "",
    email: contactsCMS?.email || "",
    address: contactsCMS?.address || "",
  });

  const handleSaveSetting = async (key: string, value: any) => {
    setSuccess("");
    setError("");
    setLoading(key);

    try {
      const response = await adminSaveSetting(key, value);
      if (response.success) {
        setSuccess(`CMS Settings for "${key.toUpperCase()}" updated successfully.`);
        router.refresh();
      } else {
        setError(response.error || "Failed to update settings.");
      }
    } catch {
      setError("Server communications error.");
    } finally {
      setLoading(null);
    }
  };

  const updateTeamMember = (idx: number, field: "name" | "role", val: string) => {
    const updatedTeam = [...aboutState.team];
    updatedTeam[idx] = { ...updatedTeam[idx], [field]: val };
    setAboutState({ ...aboutState, team: updatedTeam });
  };

  return (
    <div className="space-y-10 font-body">
      {/* Workspace Header */}
      <div className="border-b border-white/10 pb-4">
        <h1 className="font-display text-2xl font-black tracking-widest text-white uppercase">
          GLOBAL BRAND CONTENT CMS
        </h1>
        <p className="text-white/45 text-xs mt-1">
          Adjust texts and settings across storefront page segments.
        </p>
      </div>

      {/* Notifications */}
      {success && (
        <div className="bg-green-500/10 border border-green-500/30 text-green-400 p-4 text-xs">
          {success}
        </div>
      )}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 text-xs flex items-center space-x-2">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-8">
        
        {/* Form 1: About Page Manifesto & History */}
        <div className="bg-black border border-white/10 p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center space-x-2.5">
              <Info className="h-4 w-4 text-white/40" />
              <h3 className="font-display text-xs text-white tracking-widest font-black uppercase">
                ABOUT PAGE NARRATIVE
              </h3>
            </div>
            <button
              onClick={() => handleSaveSetting("about_cms", aboutState)}
              disabled={loading === "about_cms"}
              className="bg-white text-black px-4 py-2 text-xs font-display font-black tracking-widest hover:bg-white/80 transition-colors uppercase flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
            >
              <Save className="h-3 w-3" />
              <span>{loading === "about_cms" ? "SAVING..." : "SAVE ABOUT CMS"}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* Manifesto */}
            <div className="space-y-1">
              <label htmlFor="cms-manifesto" className="block text-xs font-display tracking-widest text-white/50 uppercase">
                BRAND MANIFESTO STATEMENT
              </label>
              <textarea
                id="cms-manifesto"
                rows={2}
                value={aboutState.manifesto}
                onChange={(e) => setAboutState({ ...aboutState, manifesto: e.target.value })}
                className="w-full bg-card-dark border border-white/10 px-4 py-3 text-xs text-white focus:outline-hidden resize-none"
              />
            </div>

            {/* History */}
            <div className="space-y-1">
              <label htmlFor="cms-history" className="block text-xs font-display tracking-widest text-white/50 uppercase">
                BRAND HISTORY NARRATIVE (ABOUT)
              </label>
              <textarea
                id="cms-history"
                rows={4}
                value={aboutState.history}
                onChange={(e) => setAboutState({ ...aboutState, history: e.target.value })}
                className="w-full bg-card-dark border border-white/10 px-4 py-3 text-xs text-white focus:outline-hidden resize-none"
              />
            </div>

            {/* Team Members Grid */}
            <div className="space-y-3 pt-2">
              <h4 className="font-display text-xs tracking-widest text-white/50 uppercase">
                CORE FOUNDER MEMBERS
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {aboutState.team.map((member: any, idx: number) => (
                  <div key={idx} className="border border-white/5 p-4 space-y-3 bg-neutral-950">
                    <span className="font-display text-xs text-white/30 uppercase">FOUNDER 0{idx + 1}</span>
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Founder Name"
                        value={member.name}
                        onChange={(e) => updateTeamMember(idx, "name", e.target.value)}
                        className="w-full bg-card-dark border border-white/10 px-3 py-2 text-xs text-white focus:outline-hidden"
                      />
                      <input
                        type="text"
                        placeholder="Founder Role"
                        value={member.role}
                        onChange={(e) => updateTeamMember(idx, "role", e.target.value)}
                        className="w-full bg-card-dark border border-white/10 px-3 py-2 text-xs text-white focus:outline-hidden"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Form 2: Social Links */}
        <div className="bg-black border border-white/10 p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center space-x-2.5">
              <Share2 className="h-4 w-4 text-white/40" />
              <h3 className="font-display text-xs text-white tracking-widest font-black uppercase">
                SOCIAL PLATFORMS
              </h3>
            </div>
            <button
              onClick={() => handleSaveSetting("socials_cms", socialsState)}
              disabled={loading === "socials_cms"}
              className="bg-white text-black px-4 py-2 text-xs font-display font-black tracking-widest hover:bg-white/80 transition-colors uppercase flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
            >
              <Save className="h-3 w-3" />
              <span>{loading === "socials_cms" ? "SAVING..." : "SAVE SOCIALS"}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Instagram */}
            <div className="space-y-1">
              <label htmlFor="cms-instagram" className="block text-xs font-display tracking-widest text-white/50 uppercase">
                INSTAGRAM LINK
              </label>
              <input
                id="cms-instagram"
                type="url"
                value={socialsState.instagram}
                onChange={(e) => setSocialsState({ ...socialsState, instagram: e.target.value })}
                className="w-full bg-card-dark border border-white/10 px-4 py-3 text-xs text-white focus:outline-hidden"
              />
            </div>

            {/* Twitter */}
            <div className="space-y-1">
              <label htmlFor="cms-twitter" className="block text-xs font-display tracking-widest text-white/50 uppercase">
                TWITTER (X) LINK
              </label>
              <input
                id="cms-twitter"
                type="url"
                value={socialsState.twitter}
                onChange={(e) => setSocialsState({ ...socialsState, twitter: e.target.value })}
                className="w-full bg-card-dark border border-white/10 px-4 py-3 text-xs text-white focus:outline-hidden"
              />
            </div>

            {/* Youtube */}
            <div className="space-y-1">
              <label htmlFor="cms-youtube" className="block text-xs font-display tracking-widest text-white/50 uppercase">
                YOUTUBE LINK
              </label>
              <input
                id="cms-youtube"
                type="url"
                value={socialsState.youtube}
                onChange={(e) => setSocialsState({ ...socialsState, youtube: e.target.value })}
                className="w-full bg-card-dark border border-white/10 px-4 py-3 text-xs text-white focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Form 3: Contact Channels */}
        <div className="bg-black border border-white/10 p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center space-x-2.5">
              <PhoneCall className="h-4 w-4 text-white/40" />
              <h3 className="font-display text-xs text-white tracking-widest font-black uppercase">
                CONTACT CHANNELS & PHONE
              </h3>
            </div>
            <button
              onClick={() => handleSaveSetting("contacts_cms", contactsState)}
              disabled={loading === "contacts_cms"}
              className="bg-white text-black px-4 py-2 text-xs font-display font-black tracking-widest hover:bg-white/80 transition-colors uppercase flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
            >
              <Save className="h-3 w-3" />
              <span>{loading === "contacts_cms" ? "SAVING..." : "SAVE CONTACTS"}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Phone (WhatsApp destination) */}
            <div className="space-y-1">
              <label htmlFor="cms-phone" className="block text-xs font-display tracking-widest text-white/50 uppercase">
                HOTLINE HELPLINE PHONE (WHATSAPP ROOT)
              </label>
              <input
                id="cms-phone"
                type="text"
                placeholder="Include country code, e.g. +919876543210"
                value={contactsState.phone}
                onChange={(e) => setContactsState({ ...contactsState, phone: e.target.value })}
                className="w-full bg-card-dark border border-white/10 px-4 py-3 text-xs text-white focus:outline-hidden"
              />
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label htmlFor="cms-email" className="block text-xs font-display tracking-widest text-white/50 uppercase">
                BUSINESS ADMINISTRATION EMAIL
              </label>
              <input
                id="cms-email"
                type="email"
                value={contactsState.email}
                onChange={(e) => setContactsState({ ...contactsState, email: e.target.value })}
                className="w-full bg-card-dark border border-white/10 px-4 py-3 text-xs text-white focus:outline-hidden"
              />
            </div>

            {/* Address */}
            <div className="space-y-1 md:col-span-2">
              <label htmlFor="cms-address" className="block text-xs font-display tracking-widest text-white/50 uppercase">
                STUDIO PHYSICAL POSTAL ADDRESS
              </label>
              <textarea
                id="cms-address"
                rows={2}
                value={contactsState.address}
                onChange={(e) => setContactsState({ ...contactsState, address: e.target.value })}
                className="w-full bg-card-dark border border-white/10 px-4 py-3 text-xs text-white focus:outline-hidden resize-none"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
