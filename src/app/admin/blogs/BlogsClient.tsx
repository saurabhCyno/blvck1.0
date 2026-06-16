"use client";

import { useState } from "react";
import { adminCreateBlog, adminUpdateBlog, adminDeleteBlog } from "@/app/actions";
import { useRouter } from "next/navigation";
import { Plus, X, Pencil, Trash2, ExternalLink } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";
import MarkdownEditor from "@/components/MarkdownEditor";

interface BlogsClientProps {
  initialBlogs: any[];
}

export default function BlogsClient({ initialBlogs }: BlogsClientProps) {
  const router = useRouter();
  const [blogs, setBlogs] = useState(initialBlogs);
  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any>(null);
  const [form, setForm] = useState<{
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    featuredImage: string;
    featuredImageFileId?: string | null;
  }>({ title: "", slug: "", excerpt: "", content: "", featuredImage: "", featuredImageFileId: null });
  const [saving, setSaving] = useState(false);

  const openCreate = () => {
    setEditingBlog(null);
    setForm({ title: "", slug: "", excerpt: "", content: "", featuredImage: "", featuredImageFileId: null });
    setShowModal(true);
  };

  const openEdit = (blog: any) => {
    setEditingBlog(blog);
    setForm({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      content: blog.content,
      featuredImage: blog.featuredImage || "",
      featuredImageFileId: blog.featuredImageFileId || null,
    });
    setShowModal(true);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleTitleChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      title: value,
      slug: editingBlog ? prev.slug : generateSlug(value),
    }));
  };

  const handleSave = async () => {
    if (!form.title || !form.slug || !form.excerpt || !form.content) {
      alert("Please fill in title, slug, excerpt, and content.");
      return;
    }
    setSaving(true);
    try {
      let res;
      if (editingBlog) {
        res = await adminUpdateBlog(editingBlog._id, form);
      } else {
        res = await adminCreateBlog(form);
      }
      if (res.success) {
        setShowModal(false);
        router.refresh();
        const fresh = await (await import("@/app/actions")).getBlogs();
        setBlogs(fresh);
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
    if (!confirm("Delete this editorial permanently?")) return;
    try {
      const res = await adminDeleteBlog(id);
      if (res.success) {
        setBlogs(blogs.filter((b: any) => b._id !== id));
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
            EDITORIAL MANAGER
          </h1>
          <p className="text-white/45 text-xs mt-1">
            Create and manage blog posts for the frontend editorials.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center space-x-2 border border-white/20 px-4 py-1.5 text-xs text-white hover:bg-white/5 transition-colors uppercase tracking-widest font-display font-black"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New Essay</span>
        </button>
      </div>

      {blogs.length === 0 ? (
        <p className="text-xs text-white/45 py-12 text-center">No editorials published yet.</p>
      ) : (
        <div className="bg-black border border-white/10 divide-y divide-white/10">
          {blogs.map((blog: any) => (
            <div key={blog._id} className="flex items-center justify-between p-4 gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3">
                  <h3 className="font-display text-sm text-white tracking-widest uppercase truncate">
                    {blog.title}
                  </h3>
                  <a
                    href={`/blog/${blog.slug}`}
                    target="_blank"
                    className="text-white/30 hover:text-white transition-colors flex-shrink-0"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <p className="text-[10px] text-white/40 mt-1">
                  {blog.slug} &bull; {new Date(blog.createdAt).toLocaleDateString("en-US", { dateStyle: "medium" })}
                </p>
              </div>
              <div className="flex items-center space-x-2 flex-shrink-0">
                <button
                  onClick={() => openEdit(blog)}
                  className="p-2 text-white/40 hover:text-white transition-colors"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(blog._id)}
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
          <div className="bg-[#0a0a0a] border border-white/10 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="font-display text-lg font-black tracking-widest text-white uppercase">
                {editingBlog ? "Edit Essay" : "New Essay"}
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
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full bg-black border border-white/10 px-3 py-2 text-xs text-white focus:outline-hidden focus:border-white/30"
                    placeholder="Essay Title"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-display tracking-widest text-white/50 uppercase">Slug *</label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    className="w-full bg-black border border-white/10 px-3 py-2 text-xs text-white focus:outline-hidden focus:border-white/30 font-mono"
                    placeholder="essay-title"
                  />
                </div>
              </div>

              <ImageUpload
                value={form.featuredImage}
                onChange={({ url, fileId }) => setForm({ ...form, featuredImage: url, featuredImageFileId: fileId })}
                label="Featured Image"
              />

              <div className="space-y-1.5">
                <label className="text-[10px] font-display tracking-widest text-white/50 uppercase">Excerpt *</label>
                <textarea
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  className="w-full bg-black border border-white/10 px-3 py-2 text-xs text-white focus:outline-hidden focus:border-white/30 resize-none"
                  rows={2}
                  placeholder="A short summary displayed on the editorial cards..."
                />
              </div>

              <MarkdownEditor
                value={form.content}
                onChange={(content) => setForm({ ...form, content })}
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
                {saving ? "Saving..." : editingBlog ? "Update" : "Publish"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
