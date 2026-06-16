"use client";

import { useState } from "react";
import { adminCreateHeroSlide, adminUpdateHeroSlide, adminDeleteHeroSlide } from "@/app/actions";
import { useRouter } from "next/navigation";
import { Plus, X, Pencil, Trash2, GripVertical } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";

interface HeroSlidesClientProps {
  initialSlides: any[];
}

export default function HeroSlidesClient({ initialSlides }: HeroSlidesClientProps) {
  const router = useRouter();
  const [slides, setSlides] = useState(initialSlides);
  const [showModal, setShowModal] = useState(false);
  const [editingSlide, setEditingSlide] = useState<any>(null);
  const [form, setForm] = useState<{
    title: string;
    subtitle: string;
    description: string;
    buttonText: string;
    href: string;
    image: string;
    imageFileId?: string | null;
    order: number;
  }>({
    title: "",
    subtitle: "",
    description: "",
    buttonText: "",
    href: "",
    image: "",
    imageFileId: null,
    order: 0,
  });
  const [saving, setSaving] = useState(false);

  const openCreate = () => {
    setEditingSlide(null);
    setForm({
      title: "",
      subtitle: "",
      description: "",
      buttonText: "",
      href: "/shop",
      image: "",
      imageFileId: null,
      order: slides.length,
    });
    setShowModal(true);
  };

  const openEdit = (slide: any) => {
    setEditingSlide(slide);
    setForm({
      title: slide.title,
      subtitle: slide.subtitle,
      description: slide.description,
      buttonText: slide.buttonText,
      href: slide.href,
      image: slide.image || "",
      imageFileId: slide.imageFileId || null,
      order: slide.order ?? 0,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.subtitle || !form.description || !form.buttonText || !form.href || !form.image) {
      alert("Please fill in all fields including the image.");
      return;
    }
    setSaving(true);
    try {
      let res;
      if (editingSlide) {
        res = await adminUpdateHeroSlide(editingSlide._id, form);
      } else {
        res = await adminCreateHeroSlide(form);
      }
      if (res.success) {
        setShowModal(false);
        router.refresh();
        const fresh = await (await import("@/app/actions")).adminGetHeroSlides();
        setSlides(fresh);
      } else {
        alert(res.error);
      }
    } catch {
      alert("Server error.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this hero slide permanently?")) return;
    try {
      const res = await adminDeleteHeroSlide(id);
      if (res.success) {
        setSlides(slides.filter((s: any) => s._id !== id));
        router.refresh();
      } else {
        alert(res.error);
      }
    } catch {
      alert("Server error.");
    }
  };

  return (
    <div className="space-y-10 font-body">
      <div className="border-b border-white/10 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-black tracking-widest text-white uppercase">
            HERO BANNER SLIDES
          </h1>
          <p className="text-white/45 text-xs mt-1">
            Manage the rotating hero banner on the homepage. Slides display in order.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center space-x-2 border border-white/20 px-4 py-1.5 text-xs text-white hover:bg-white/5 transition-colors uppercase tracking-widest font-display font-black"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New Slide</span>
        </button>
      </div>

      {slides.length === 0 ? (
        <p className="text-xs text-white/45 py-12 text-center">
          No hero slides yet. Create one to display on the homepage banner.
        </p>
      ) : (
        <div className="bg-black border border-white/10 divide-y divide-white/10">
          {slides.map((slide: any) => (
            <div key={slide._id} className="flex items-center justify-between p-4 gap-4">
              <div className="flex items-center space-x-4 flex-1 min-w-0">
                <GripVertical className="h-4 w-4 text-white/20 flex-shrink-0" />
                {slide.image && (
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="h-12 w-20 object-cover border border-white/10 flex-shrink-0"
                  />
                )}
                <div className="min-w-0">
                  <h3 className="font-display text-sm text-white tracking-widest uppercase truncate">
                    {slide.title}
                  </h3>
                  <p className="text-[10px] text-white/40 mt-0.5 truncate">
                    {slide.subtitle} &bull; Order: {slide.order ?? 0}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 flex-shrink-0">
                <button
                  onClick={() => openEdit(slide)}
                  className="p-2 text-white/40 hover:text-white transition-colors"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(slide._id)}
                  className="p-2 text-red-400/60 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0a0a0a] border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="font-display text-lg font-black tracking-widest text-white uppercase">
                {editingSlide ? "Edit Slide" : "New Slide"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-white/40 hover:text-white transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-display tracking-widest text-white/50 uppercase">Title *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full bg-black border border-white/10 px-3 py-2 text-xs text-white focus:outline-hidden focus:border-white/30"
                    placeholder="DROP 01: MATTE COUTURE"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-display tracking-widest text-white/50 uppercase">Order</label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                    className="w-full bg-black border border-white/10 px-3 py-2 text-xs text-white focus:outline-hidden focus:border-white/30"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-display tracking-widest text-white/50 uppercase">Subtitle *</label>
                <input
                  type="text"
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  className="w-full bg-black border border-white/10 px-3 py-2 text-xs text-white focus:outline-hidden focus:border-white/30"
                  placeholder="CARBON-DENSE APPAREL ENGINEERED FOR THE AVANT-GARDE"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-display tracking-widest text-white/50 uppercase">Description *</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-black border border-white/10 px-3 py-2 text-xs text-white focus:outline-hidden focus:border-white/30 resize-none"
                  rows={2}
                  placeholder="Zero branding. Pure light absorption. Tailored shapes that redefine visual presence."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-display tracking-widest text-white/50 uppercase">Button Text *</label>
                  <input
                    type="text"
                    value={form.buttonText}
                    onChange={(e) => setForm({ ...form, buttonText: e.target.value })}
                    className="w-full bg-black border border-white/10 px-3 py-2 text-xs text-white focus:outline-hidden focus:border-white/30"
                    placeholder="SHOP DEEP BLACKS"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-display tracking-widest text-white/50 uppercase">Link URL *</label>
                  <input
                    type="text"
                    value={form.href}
                    onChange={(e) => setForm({ ...form, href: e.target.value })}
                    className="w-full bg-black border border-white/10 px-3 py-2 text-xs text-white focus:outline-hidden focus:border-white/30"
                    placeholder="/shop"
                  />
                </div>
              </div>

              <ImageUpload
                value={form.image}
                onChange={({ url, fileId }) => setForm({ ...form, image: url, imageFileId: fileId })}
                label="Background Image (1920x1080 recommended)"
              />
            </div>

            <div className="flex items-center justify-end space-x-3 p-6 border-t border-white/10">
              <button
                onClick={() => setShowModal(false)}
                className="border border-white/10 px-6 py-2 text-xs text-white/60 hover:text-white transition-colors uppercase tracking-widest"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="border border-white/20 bg-white/5 px-6 py-2 text-xs text-white hover:bg-white/10 transition-colors uppercase tracking-widest font-display font-black disabled:opacity-30"
              >
                {saving ? "Saving..." : editingSlide ? "Update Slide" : "Create Slide"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
