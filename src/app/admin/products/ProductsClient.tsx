"use client";

import { useState } from "react";
import { adminSaveProduct, adminDeleteProduct } from "@/app/actions";
import { Plus, Trash2, Edit2, Check, X, Image as ImageIcon, Sparkles, Upload } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface ProductsClientProps {
  initialProducts: any[];
  categories: any[];
}

export default function ProductsClient({ initialProducts, categories }: ProductsClientProps) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [isEditing, setIsEditing] = useState(false);
  const [activeProduct, setActiveProduct] = useState<any | null>(null);
  
  // File upload states
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const genders = ["Men", "Women", "Unisex"];
  const sizeKeys: ("S" | "M" | "L" | "XL" | "XXL")[] = ["S", "M", "L", "XL", "XXL"];

  // Default empty schema product structure
  const emptyProduct = {
    title: "",
    description: "",
    originalPrice: 0,
    sellingPrice: 0,
    sizes: [
      { size: "S", stock: 0 },
      { size: "M", stock: 0 },
      { size: "L", stock: 0 },
      { size: "XL", stock: 0 },
      { size: "XXL", stock: 0 },
    ],
    gender: "Unisex",
    category: categories[0]?._id || "",
    images: [] as string[],
    imageFileIds: [] as string[],
    specs: {
      brand: "PREMIUM BLVCK LABELS",
      type: "",
      sleeve: "",
      fit: "",
      fabric: "",
      pattern: "",
    },
    isBestseller: false,
  };

  const handleEditClick = (product: any) => {
    // Map stock values to ensure sizes format aligns
    const formattedSizes = sizeKeys.map((k) => {
      const dbSize = product.sizes.find((s: any) => s.size === k);
      return { size: k, stock: dbSize ? dbSize.stock : 0 };
    });

    setActiveProduct({
      ...product,
      category: product.category?._id || product.category,
      sizes: formattedSizes,
    });
    setIsEditing(true);
    setError("");
    setSuccess("");
  };

  const handleNewClick = () => {
    setActiveProduct({ ...emptyProduct });
    setIsEditing(true);
    setError("");
    setSuccess("");
  };

  const handleCancelClick = () => {
    setActiveProduct(null);
    setIsEditing(false);
    setError("");
  };

  const handleInputChange = (field: string, val: any) => {
    setActiveProduct({ ...activeProduct, [field]: val });
  };

  const handleSpecsChange = (field: string, val: string) => {
    setActiveProduct({
      ...activeProduct,
      specs: { ...activeProduct.specs, [field]: val },
    });
  };

  const handleStockChange = (size: string, stockVal: number) => {
    const updatedSizes = activeProduct.sizes.map((s: any) =>
      s.size === size ? { ...s, stock: Math.max(0, stockVal) } : s
    );
    setActiveProduct({ ...activeProduct, sizes: updatedSizes });
  };

  // Image upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok && data.url) {
        setActiveProduct({
          ...activeProduct,
          images: [...(activeProduct.images || []), data.url],
          imageFileIds: [...(activeProduct.imageFileIds || []), data.fileId],
        });
      } else {
        setError(data.error || "Failed to upload file.");
      }
    } catch {
      setError("An error occurred during file upload.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (idx: number) => {
    const filteredImages = activeProduct.images.filter((_: any, i: number) => i !== idx);
    const filteredFileIds = (activeProduct.imageFileIds || []).filter((_: any, i: number) => i !== idx);
    setActiveProduct({ ...activeProduct, images: filteredImages, imageFileIds: filteredFileIds });
  };

  // Submit product creation / updates
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!activeProduct.category) {
      setError("Please assign a category tag.");
      return;
    }

    setSaving(true);
    try {
      const response = await adminSaveProduct(activeProduct);
      if (response.success && response.product) {
        if (activeProduct._id) {
          // Update item inline
          setProducts(
            products.map((p) => (p._id === activeProduct._id ? response.product : p))
          );
          setSuccess(`Product "${activeProduct.title}" updated successfully.`);
        } else {
          // Prepend new item
          setProducts([response.product, ...products]);
          setSuccess(`Product "${activeProduct.title}" created successfully.`);
        }
        setIsEditing(false);
        setActiveProduct(null);
        router.refresh();
      } else {
        setError(response.error || "Failed to save product.");
      }
    } catch {
      setError("Server communications error.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete the product "${title}"?`)) return;

    setError("");
    setSuccess("");
    try {
      const response = await adminDeleteProduct(id);
      if (response.success) {
        setProducts(products.filter((p) => p._id !== id));
        setSuccess(`Product "${title}" deleted successfully.`);
        router.refresh();
      } else {
        setError(response.error || "Failed to delete product.");
      }
    } catch {
      setError("Server communications error.");
    }
  };

  return (
    <div className="space-y-10 font-body">
      {/* Workspace Header */}
      <div className="border-b border-white/10 pb-4 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-black tracking-widest text-white uppercase">
            PRODUCT CRUD ENGINE
          </h1>
          <p className="text-white/45 text-xs mt-1">
            Build, edit, and purge catalog items.
          </p>
        </div>

        {!isEditing && (
          <button
            onClick={handleNewClick}
            className="bg-white text-black font-display font-black text-xs px-5 py-3 tracking-widest hover:bg-white/80 transition-colors uppercase flex items-center space-x-1.5 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>NEW PRODUCT</span>
          </button>
        )}
      </div>

      {/* Notifications */}
      {success && (
        <div className="bg-green-500/10 border border-green-500/30 text-green-400 p-4 text-xs">
          {success}
        </div>
      )}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 text-xs">
          {error}
        </div>
      )}

      {/* EDITING / CREATING WORKSPACE FORM PANEL */}
      {isEditing && activeProduct ? (
        <form onSubmit={handleFormSubmit} className="bg-black border border-white/10 p-6 md:p-8 space-y-8 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="font-display text-sm tracking-widest text-white font-black uppercase">
              {activeProduct._id ? "MODIFY SPECIFICATIONS" : "CREATE NEW DROPS"}
            </h3>
            <button
              type="button"
              onClick={handleCancelClick}
              className="text-white/45 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="space-y-1">
              <label htmlFor="prod-title" className="block text-xs font-display tracking-widest text-white/50 uppercase">
                PRODUCT TITLE
              </label>
              <input
                id="prod-title"
                type="text"
                required
                value={activeProduct.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="w-full bg-card-dark border border-white/10 px-4 py-3 text-xs text-white focus:outline-hidden"
              />
            </div>

            {/* Category */}
            <div className="space-y-1">
              <label htmlFor="prod-category" className="block text-xs font-display tracking-widest text-white/50 uppercase">
                ASSIGN CLASSIFICATION
              </label>
              <select
                id="prod-category"
                required
                value={activeProduct.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                className="w-full bg-card-dark border border-white/10 px-4 py-3.5 text-xs text-white focus:outline-hidden"
              >
                <option value="">Choose Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className="space-y-1 md:col-span-2">
              <label htmlFor="prod-description" className="block text-xs font-display tracking-widest text-white/50 uppercase">
                COMPOSITION / DESCRIPTIVE COPY (Supports Markdown formatting)
              </label>
              <textarea
                id="prod-description"
                required
                rows={3}
                value={activeProduct.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="w-full bg-card-dark border border-white/10 px-4 py-3 text-xs text-white focus:outline-hidden resize-none"
              />
            </div>

            {/* Original price */}
            <div className="space-y-1">
              <label htmlFor="prod-original-price" className="block text-xs font-display tracking-widest text-white/50 uppercase">
                ORIGINAL STRIKE PRICE (₹)
              </label>
              <input
                id="prod-original-price"
                type="number"
                step="0.01"
                required
                value={activeProduct.originalPrice || ""}
                onChange={(e) => handleInputChange("originalPrice", parseFloat(e.target.value) || 0)}
                className="w-full bg-card-dark border border-white/10 px-4 py-3 text-xs text-white focus:outline-hidden"
              />
            </div>

            {/* Selling price */}
            <div className="space-y-1">
              <label htmlFor="prod-selling-price" className="block text-xs font-display tracking-widest text-white/50 uppercase">
                ACTUAL SELLING COST (₹)
              </label>
              <input
                id="prod-selling-price"
                type="number"
                step="0.01"
                required
                value={activeProduct.sellingPrice || ""}
                onChange={(e) => handleInputChange("sellingPrice", parseFloat(e.target.value) || 0)}
                className="w-full bg-card-dark border border-white/10 px-4 py-3 text-xs text-white focus:outline-hidden"
              />
            </div>

            {/* Gender */}
            <div className="space-y-1">
              <label htmlFor="prod-gender" className="block text-xs font-display tracking-widest text-white/50 uppercase">
                TARGET GENDER
              </label>
              <select
                id="prod-gender"
                value={activeProduct.gender}
                onChange={(e) => handleInputChange("gender", e.target.value)}
                className="w-full bg-card-dark border border-white/10 px-4 py-3.5 text-xs text-white focus:outline-hidden"
              >
                {genders.map((g) => (
                  <option key={g} value={g}>
                    {g.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            {/* Bestseller checkbox */}
            <div className="flex items-center space-x-3 pt-6">
              <input
                id="prod-bestseller"
                type="checkbox"
                checked={activeProduct.isBestseller}
                onChange={(e) => handleInputChange("isBestseller", e.target.checked)}
                className="h-4 w-4 bg-card-dark border border-white/10 rounded-none checked:bg-white checked:border-white focus:outline-hidden"
              />
              <label htmlFor="prod-bestseller" className="text-xs font-display tracking-widest text-white uppercase select-none">
                MARK AS BESTSELLER
              </label>
            </div>
          </div>

          {/* Size Variant Stock Matrix */}
          <div className="space-y-4 border-t border-white/5 pt-6">
            <h4 className="font-display text-xs tracking-widest text-white/50 uppercase">
              SIZING STOCK MATRIX
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {activeProduct.sizes.map((s: any) => (
                <div key={s.size} className="border border-white/5 p-3.5 bg-neutral-950 flex flex-col items-center">
                  <span className="font-display text-xs text-white tracking-wider">{s.size}</span>
                  <input
                    type="number"
                    min="0"
                    value={s.stock}
                    onChange={(e) => handleStockChange(s.size, parseInt(e.target.value, 10) || 0)}
                    className="w-16 text-center bg-card-dark border border-white/10 mt-2 py-1 text-xs text-white focus:outline-hidden"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Specs */}
          <div className="space-y-4 border-t border-white/5 pt-6">
            <h4 className="font-display text-xs tracking-widest text-white/50 uppercase">
              GARMENT SPECIFICATIONS
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {Object.keys(activeProduct.specs || {}).map((specKey) => (
                <div key={specKey} className="space-y-1">
                  <label htmlFor={`spec-${specKey}`} className="block text-xs font-display tracking-widest text-white/40 uppercase">
                    {specKey}
                  </label>
                  <input
                    id={`spec-${specKey}`}
                    type="text"
                    required
                    value={activeProduct.specs[specKey] || ""}
                    onChange={(e) => handleSpecsChange(specKey, e.target.value)}
                    className="w-full bg-card-dark border border-white/10 px-3 py-2 text-xs text-white focus:outline-hidden"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Image Uploader & Previews */}
          <div className="space-y-4 border-t border-white/5 pt-6">
            <h4 className="font-display text-xs tracking-widest text-white/50 uppercase">
              MEDIA GALLERY ASSETS
            </h4>

            {/* Previews grid */}
            {activeProduct.images?.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                {activeProduct.images.map((img: string, idx: number) => (
                  <div key={idx} className="relative aspect-[3/4] border border-white/10 bg-neutral-950 overflow-hidden group">
                    <Image
                      src={img}
                      alt={`Upload preview ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute inset-0 bg-black/60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Asynchronous File Input Dropzone */}
            <div className="border border-dashed border-white/20 p-6 flex flex-col items-center justify-center space-y-2 cursor-pointer hover:border-white transition-colors relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              {uploading ? (
                <div className="animate-spin text-white">
                  <Upload className="h-6 w-6" />
                </div>
              ) : (
                <ImageIcon className="h-6 w-6 text-white/30" />
              )}
              <p className="font-display text-xs text-white tracking-widest uppercase">
                {uploading ? "Uploading media file..." : "Click or drag to upload apparel photo"}
              </p>
              <p className="text-xs text-white/30">PNG, JPG, or WEBP. Uploads to ImageKit.io</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex space-x-4 pt-4 border-t border-white/10">
            <button
              type="submit"
              disabled={saving}
              className="bg-white text-black font-display font-black text-xs px-8 py-4.5 tracking-widest hover:bg-white/80 transition-colors uppercase flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
            >
              <Check className="h-4.5 w-4.5" />
              <span>{saving ? "SAVING..." : "SAVE CHANGES"}</span>
            </button>
            <button
              type="button"
              onClick={handleCancelClick}
              className="border border-white/20 text-white font-display text-xs px-8 py-4.5 tracking-widest hover:border-white transition-colors uppercase"
            >
              CANCEL
            </button>
          </div>
        </form>
      ) : (
        /* PRODUCTS DIRECTORY TABLE/GRID */
        <div className="bg-black border border-white/10 overflow-hidden">
          {products.length === 0 ? (
            <div className="p-12 text-center text-xs text-white/45">
              No products found in MongoDB. Seed sample data from Homepage first.
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {products.map((product) => {
                const totalStock = product.sizes.reduce((sum: number, s: any) => sum + s.stock, 0);
                const hasNoStock = totalStock === 0;

                return (
                  <div key={product._id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-center space-x-4">
                      {/* Miniature thumbnail */}
                      <div className="relative h-16 w-12 flex-shrink-0 bg-neutral-950 border border-white/10 overflow-hidden">
                        {product.images?.[0] ? (
                          <Image
                            src={product.images[0]}
                            alt={product.title}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-white/25">
                            <ImageIcon className="h-4 w-4" />
                          </div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <h3 className="font-display text-sm tracking-widest text-white uppercase">
                          {product.title}
                        </h3>
                        <p className="text-xs text-white/40 uppercase">
                          {product.category?.name || "Unassigned"} &bull; {product.gender}
                        </p>
                      </div>
                    </div>

                    {/* Stock, Price, Actions */}
                    <div className="flex items-center justify-between sm:justify-end space-x-8">
                      <div className="space-y-1 text-right">
                        <span className="font-mono text-xs font-bold text-white block">
                          ₹{product.sellingPrice.toFixed(2)}
                        </span>
                        <span className={`text-xs font-display tracking-widest uppercase ${hasNoStock ? "text-red-500 font-black" : "text-white/45"}`}>
                          STOCK: {totalStock}
                        </span>
                      </div>

                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleEditClick(product)}
                          className="p-2 border border-white/10 text-white/60 hover:text-white hover:border-white transition-colors"
                          aria-label={`Edit ${product.title}`}
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product._id, product.title)}
                          className="p-2 border border-white/10 text-white/60 hover:text-red-500 hover:border-red-500/20 transition-colors"
                          aria-label={`Delete ${product.title}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
