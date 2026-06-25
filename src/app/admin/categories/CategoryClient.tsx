"use client";

import { useState } from "react";
import { adminSaveCategory, adminDeleteCategory } from "@/app/actions";
import { Plus, Trash2, Tag, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import Pagination from "@/components/Pagination";

interface CategoryClientProps {
  initialCategories: any[];
}

const PAGE_SIZE = 10;

export default function CategoryClient({ initialCategories }: CategoryClientProps) {
  const router = useRouter();
  const [categories, setCategories] = useState(initialCategories);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(categories.length / PAGE_SIZE);
  const paginatedCategories = categories.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!newCategoryName.trim()) return;

    setLoading(true);
    try {
      const response = await adminSaveCategory(newCategoryName.trim());
      if (response.success && response.category) {
        setCategories([...categories, response.category]);
        setNewCategoryName("");
        setSuccess(`Category "${newCategoryName}" created successfully.`);
        router.refresh();
      } else {
        setError(response.error || "Failed to create category.");
      }
    } catch {
      setError("Server communications error.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the category "${name}"?`)) return;

    setError("");
    setSuccess("");
    try {
      const response = await adminDeleteCategory(id);
      if (response.success) {
        setCategories(categories.filter((cat) => cat._id !== id));
        setSuccess(`Category "${name}" deleted.`);
        router.refresh();
      } else {
        setError(response.error || "Failed to delete category.");
      }
    } catch {
      setError("Server communications error.");
    }
  };

  return (
    <div className="space-y-10 font-body">
      {/* Workspace Header */}
      <div className="border-b border-white/10 pb-4">
        <h1 className="font-display text-2xl font-black tracking-widest text-white uppercase">
          CATEGORY MANAGER
        </h1>
        <p className="text-white/45 text-xs mt-1">
          Create, view, and purge collection classification tags.
        </p>
      </div>

      {/* Notifications */}
      {success && (
        <div className="bg-green-500/10 border border-green-500/30 text-green-400 p-4 text-xs">
          {success}
        </div>
      )}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 text-xs flex items-start space-x-2">
          <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Creator Form */}
        <form onSubmit={handleAddCategory} className="lg:col-span-5 bg-black border border-white/10 p-6 space-y-4">
          <h3 className="font-display text-xs text-white tracking-widest font-black uppercase border-b border-white/5 pb-2">
            CREATE DYNAMIC CATEGORY
          </h3>
          <div className="space-y-2">
            <label htmlFor="new-category-name" className="block text-xs font-display tracking-widest text-white/50">
              CATEGORY NAME
            </label>
            <input
              id="new-category-name"
              type="text"
              required
              placeholder="e.g. Outerwear"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="w-full bg-card-dark border border-white/10 px-4 py-3 text-xs text-white focus:outline-hidden focus:border-white transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black font-display font-black text-xs py-3.5 tracking-widest hover:bg-white/80 transition-all uppercase flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>{loading ? "CREATING..." : "ADD CATEGORY"}</span>
          </button>
        </form>

        {/* Right: Category List */}
        <div className="lg:col-span-7 bg-black border border-white/10 p-6 space-y-4">
          <h3 className="font-display text-xs text-white tracking-widest font-black uppercase border-b border-white/5 pb-2">
            CLASSIFICATION DIRECTORY ({categories.length})
          </h3>

          {categories.length === 0 ? (
            <p className="text-xs text-white/45 py-4">No categories configured in MongoDB.</p>
          ) : (
            <div className="divide-y divide-white/5">
              {paginatedCategories.map((cat) => (
                <div key={cat._id} className="flex justify-between items-center py-3.5 first:pt-0 last:pb-0">
                  <div className="flex items-center space-x-3">
                    <Tag className="h-4 w-4 text-white/30" />
                    <span className="text-xs font-display tracking-widest text-white uppercase">
                      {cat.name}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteCategory(cat._id, cat.name)}
                    className="text-white/45 hover:text-red-400 transition-colors"
                    aria-label={`Delete category ${cat.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
