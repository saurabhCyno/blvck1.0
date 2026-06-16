"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { dbConnect } from "@/lib/db";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";
import { Order } from "@/models/Order";
import { Inquiry } from "@/models/Inquiry";
import { Blog } from "@/models/Blog";
import { Setting } from "@/models/Setting";
import { User } from "@/models/User";
import { HeroSlide } from "@/models/HeroSlide";
import bcrypt from "bcryptjs";
import ImageKit from "@imagekit/nodejs";
import {
  sendEmail,
  buildOrderConfirmationHtml,
  buildAdminNotificationHtml,
  buildStatusUpdateHtml,
  ADMIN_EMAIL,
} from "@/lib/mail";

const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
});

// --- IMAGEKIT HELPER ---
async function deleteImageFromImageKit(url: string, fileId?: string | null) {
  if (!url || url.startsWith("data:")) return;

  let id = fileId;
  if (!id) {
    const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;
    if (!urlEndpoint) return;
    const path = url.replace(urlEndpoint, "").split("?")[0].replace(/^\//, "");
    const segments = path.split("/");
    const filtered = segments.filter((s) => !s.startsWith("tr:"));
    id = filtered.join("/");
  }

  if (!id) return;

  try {
    await imagekit.files.delete(id);
  } catch (err: any) {
    console.error(`[ImageKit] Failed to delete "${id}" (${url}):`, err.message || err);
  }
}

// --- AUTHENTICATION ACTION ---
export async function adminLogin(password: string): Promise<{ success: boolean; error?: string }> {
  const adminPass = process.env.ADMIN_PASSWORD || "adminblvck";
  if (password === adminPass) {
    const cookieStore = await cookies();
    cookieStore.set("admin_session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });
    return { success: true };
  }
  return { success: false, error: "Incorrect administrator key." };
}

export async function adminLogout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
}

export async function checkAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get("admin_session")?.value === "authenticated";
}

// --- STOREFRONT GETTERS ---
export async function getCategories() {
  await dbConnect();
  return JSON.parse(JSON.stringify(await Category.find({})));
}

export async function getProducts(filters: {
  category?: string;
  gender?: string;
  size?: string;
  search?: string;
  page?: number;
  limit?: number;
} = {}) {
  await dbConnect();
  const page = filters.page || 1;
  const limit = filters.limit || 9;
  const skip = (page - 1) * limit;

  const query: any = {};

  if (filters.category) {
    query.category = filters.category;
  }
  if (filters.gender) {
    query.gender = filters.gender;
  }
  if (filters.size) {
    query["sizes"] = { $elemMatch: { size: filters.size, stock: { $gt: 0 } } };
  }
  if (filters.search) {
    query.title = { $regex: filters.search, $options: "i" };
  }

  const items = await Product.find(query)
    .populate("category")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Product.countDocuments(query);

  return {
    products: JSON.parse(JSON.stringify(items)),
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  };
}

export async function getProductById(id: string) {
  await dbConnect();
  try {
    const item = await Product.findById(id).populate("category");
    return item ? JSON.parse(JSON.stringify(item)) : null;
  } catch {
    return null;
  }
}

export async function getBestsellers() {
  await dbConnect();
  const items = await Product.find({ isBestseller: true }).populate("category").limit(6);
  return JSON.parse(JSON.stringify(items));
}

export async function getLatestDrops() {
  await dbConnect();
  const items = await Product.find({}).populate("category").sort({ createdAt: -1 }).limit(6);
  return JSON.parse(JSON.stringify(items));
}

export async function getRelatedProducts(categoryId: string, excludeProductId: string) {
  await dbConnect();
  const items = await Product.find({
    category: categoryId,
    _id: { $ne: excludeProductId }
  })
    .limit(4);
  return JSON.parse(JSON.stringify(items));
}

export async function getBlogs() {
  await dbConnect();
  const items = await Blog.find({}).sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(items));
}

export async function getBlogBySlug(slug: string) {
  await dbConnect();
  const item = await Blog.findOne({ slug });
  return item ? JSON.parse(JSON.stringify(item)) : null;
}

// --- USER AUTH ACTIONS ---
export async function userSignup(formData: {
  name: string;
  email: string;
  phone: string;
  password: string;
}) {
  await dbConnect();
  try {
    const existing = await User.findOne({ email: formData.email });
    if (existing) {
      return { success: false, error: "An account with this email already exists." };
    }

    const hashedPassword = await bcrypt.hash(formData.password, 12);
    const user = await User.create({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: hashedPassword,
    });

    const cookieStore = await cookies();
    cookieStore.set("user_session", user._id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return { success: true, user: { id: user._id.toString(), name: user.name, email: user.email } };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create account." };
  }
}

export async function userLogin(formData: { email: string; password: string }) {
  await dbConnect();
  try {
    const user = await User.findOne({ email: formData.email });
    if (!user) {
      return { success: false, error: "Invalid email or password." };
    }

    const valid = await bcrypt.compare(formData.password, user.password);
    if (!valid) {
      return { success: false, error: "Invalid email or password." };
    }

    const cookieStore = await cookies();
    cookieStore.set("user_session", user._id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return { success: true, user: { id: user._id.toString(), name: user.name, email: user.email } };
  } catch (error: any) {
    return { success: false, error: error.message || "Login failed." };
  }
}

export async function userLogout() {
  const cookieStore = await cookies();
  cookieStore.delete("user_session");
}

export async function checkUserSession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("user_session")?.value;
  if (!sessionId) return null;

  await dbConnect();
  const user = await User.findById(sessionId);
  if (!user) return null;

  return { id: user._id.toString(), name: user.name, email: user.email, phone: user.phone };
}

export async function getUserOrders() {
  const user = await checkUserSession();
  if (!user) throw new Error("Not authenticated.");

  await dbConnect();
  const orders = await Order.find({ "customerInfo.email": user.email })
    .populate("items.productId")
    .sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(orders));
}

export async function updateUserProfile(formData: { name: string; phone: string }) {
  const user = await checkUserSession();
  if (!user) throw new Error("Not authenticated.");

  await dbConnect();
  await User.findByIdAndUpdate(user.id, { name: formData.name, phone: formData.phone });
  return { success: true };
}

// --- ADMIN BLOG ACTIONS ---
export async function adminCreateBlog(formData: {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  featuredImageFileId?: string | null;
}) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) throw new Error("Unauthorized access.");

  await dbConnect();
  try {
    const existing = await Blog.findOne({ slug: formData.slug });
    if (existing) {
      return { success: false, error: "A blog with this slug already exists." };
    }

    const blog = await Blog.create({
      title: formData.title,
      slug: formData.slug,
      excerpt: formData.excerpt,
      content: formData.content,
      featuredImage: formData.featuredImage,
      featuredImageFileId: formData.featuredImageFileId || undefined,
    });

    revalidatePath("/blog");
    return { success: true, blog: JSON.parse(JSON.stringify(blog)) };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create blog." };
  }
}

export async function adminUpdateBlog(id: string, formData: {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  featuredImageFileId?: string | null;
}) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) throw new Error("Unauthorized access.");

  await dbConnect();
  try {
    const existing = await Blog.findOne({ slug: formData.slug, _id: { $ne: id } });
    if (existing) {
      return { success: false, error: "Another blog with this slug already exists." };
    }

    const updateData: any = {
      title: formData.title,
      slug: formData.slug,
      excerpt: formData.excerpt,
      content: formData.content,
      featuredImage: formData.featuredImage,
    };
    if (formData.featuredImageFileId !== undefined) {
      updateData.featuredImageFileId = formData.featuredImageFileId || null;
    }

    const blog = await Blog.findByIdAndUpdate(id, updateData, { new: true });

    revalidatePath("/blog");
    return { success: true, blog: JSON.parse(JSON.stringify(blog)) };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update blog." };
  }
}

export async function adminDeleteBlog(id: string) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) throw new Error("Unauthorized access.");

  await dbConnect();
  try {
    const blog = await Blog.findById(id);
    if (blog?.featuredImage) {
      await deleteImageFromImageKit(blog.featuredImage, blog.featuredImageFileId);
    }
    await Blog.findByIdAndDelete(id);
    revalidatePath("/blog");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// --- HERO SLIDE ACTIONS ---
export async function getHeroSlides() {
  await dbConnect();
  const slides = await HeroSlide.find({}).sort({ order: 1, createdAt: -1 });
  return JSON.parse(JSON.stringify(slides));
}

export async function adminGetHeroSlides() {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) throw new Error("Unauthorized access.");

  await dbConnect();
  const slides = await HeroSlide.find({}).sort({ order: 1, createdAt: -1 });
  return JSON.parse(JSON.stringify(slides));
}

export async function adminCreateHeroSlide(formData: {
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  href: string;
  image: string;
  imageFileId?: string | null;
  order: number;
}) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) throw new Error("Unauthorized access.");

  await dbConnect();
  try {
    const slide = await HeroSlide.create(formData);
    revalidatePath("/");
    return { success: true, slide: JSON.parse(JSON.stringify(slide)) };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create slide." };
  }
}

export async function adminUpdateHeroSlide(
  id: string,
  formData: {
    title: string;
    subtitle: string;
    description: string;
    buttonText: string;
    href: string;
    image: string;
    imageFileId?: string | null;
    order: number;
  }
) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) throw new Error("Unauthorized access.");

  await dbConnect();
  try {
    const updateData: any = { ...formData };
    if (formData.imageFileId === undefined) {
      updateData.imageFileId = null;
    }
    const slide = await HeroSlide.findByIdAndUpdate(id, updateData, { new: true });
    revalidatePath("/");
    return { success: true, slide: JSON.parse(JSON.stringify(slide)) };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update slide." };
  }
}

export async function adminDeleteHeroSlide(id: string) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) throw new Error("Unauthorized access.");

  await dbConnect();
  try {
    const slide = await HeroSlide.findById(id);
    if (slide?.image) {
      await deleteImageFromImageKit(slide.image, slide.imageFileId);
    }
    await HeroSlide.findByIdAndDelete(id);
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getSetting(key: string) {
  await dbConnect();
  const setting = await Setting.findOne({ key });
  return setting ? JSON.parse(JSON.stringify(setting.value)) : null;
}

// --- DATA MUTATIONS (Client Server Actions) ---
export async function createOrder(formData: {
  customerInfo: { name: string; email: string; phone: string; address: string };
  items: { productId: string; size: string; quantity: number; priceAtPurchase: number }[];
  totalAmount: number;
}) {
  await dbConnect();
  try {
    // 1. Double check and deduct stock
    for (const item of formData.items) {
      const dbProduct = await Product.findById(item.productId);
      if (!dbProduct) {
        throw new Error(`Product not found.`);
      }
      
      const sizeIndex = dbProduct.sizes.findIndex((s: any) => s.size === item.size);
      if (sizeIndex === -1 || dbProduct.sizes[sizeIndex].stock < item.quantity) {
        throw new Error(`Insufficient stock for product: ${dbProduct.title} (${item.size})`);
      }
      
      dbProduct.sizes[sizeIndex].stock -= item.quantity;
      await dbProduct.save();
    }

    // 2. Create the order
    const newOrder = await Order.create({
      customerInfo: formData.customerInfo,
      items: formData.items,
      totalAmount: formData.totalAmount,
      paymentMethod: "COD",
      orderStatus: "Pending",
    });

    // 3. Send confirmation emails
    const itemDetails = await Promise.all(
      formData.items.map(async (item) => {
        const p = await Product.findById(item.productId);
        return {
          title: p ? p.title : "Product",
          size: item.size,
          quantity: item.quantity,
          price: item.priceAtPurchase,
        };
      })
    );

    try {
      await sendEmail({
        to: formData.customerInfo.email,
        subject: `Order Confirmed - REF-${newOrder._id.toString().substring(newOrder._id.toString().length - 8)}`,
        html: buildOrderConfirmationHtml(
          newOrder._id.toString(),
          formData.customerInfo,
          itemDetails,
          formData.totalAmount
        ),
      });
    } catch (emailErr) {
      console.warn("Failed to send user confirmation email:", emailErr);
    }

    try {
      await sendEmail({
        to: ADMIN_EMAIL,
        subject: `New Order - REF-${newOrder._id.toString().substring(newOrder._id.toString().length - 8)}`,
        html: buildAdminNotificationHtml(
          newOrder._id.toString(),
          formData.customerInfo,
          itemDetails,
          formData.totalAmount
        ),
      });
    } catch (emailErr) {
      console.warn("Failed to send admin notification email:", emailErr);
    }

    revalidatePath("/admin/dashboard");
    return { success: true, orderId: newOrder._id.toString() };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create order." };
  }
}

export async function createInquiry(formData: {
  name: string;
  email: string;
  phone: string;
  message: string;
}) {
  await dbConnect();
  try {
    await Inquiry.create(formData);
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to submit inquiry." };
  }
}

// --- ADMIN CONTROL ACTIONS ---
export async function adminSaveProduct(productData: any) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) throw new Error("Unauthorized access.");

  await dbConnect();
  try {
    let product;
    if (productData._id) {
      product = await Product.findByIdAndUpdate(productData._id, productData, { new: true });
    } else {
      product = await Product.create(productData);
    }
    revalidatePath("/shop");
    revalidatePath(`/product/${product._id}`);
    return { success: true, product: JSON.parse(JSON.stringify(product)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function adminDeleteProduct(id: string) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) throw new Error("Unauthorized access.");

  await dbConnect();
  try {
    const product = await Product.findById(id);
    if (product?.images?.length) {
      await Promise.all(
        product.images.map((img: string, i: number) =>
          deleteImageFromImageKit(img, product.imageFileIds?.[i])
        )
      );
    }
    await Product.findByIdAndDelete(id);
    revalidatePath("/shop");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function adminSaveCategory(name: string) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) throw new Error("Unauthorized access.");

  await dbConnect();
  try {
    const existing = await Category.findOne({ name });
    if (existing) return { success: false, error: "Category already exists." };
    const cat = await Category.create({ name });
    revalidatePath("/shop");
    return { success: true, category: JSON.parse(JSON.stringify(cat)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function adminDeleteCategory(id: string) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) throw new Error("Unauthorized access.");

  await dbConnect();
  try {
    // Check if any product belongs to this category
    const productsUsing = await Product.countDocuments({ category: id });
    if (productsUsing > 0) {
      return { success: false, error: "Cannot delete category while products are assigned to it." };
    }
    await Category.findByIdAndDelete(id);
    revalidatePath("/shop");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function adminGetOrders() {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) throw new Error("Unauthorized access.");

  await dbConnect();
  const items = await Order.find({}).populate("items.productId").sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(items));
}

export async function adminUpdateOrderStatus(orderId: string, status: string) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) throw new Error("Unauthorized access.");

  await dbConnect();
  try {
    const order = await Order.findByIdAndUpdate(orderId, { orderStatus: status }, { new: true });
    if (!order) throw new Error("Order not found.");

    try {
      await sendEmail({
        to: order.customerInfo.email,
        subject: `Order ${status.toUpperCase()} - REF-${orderId.substring(orderId.length - 8)}`,
        html: buildStatusUpdateHtml(orderId, order.customerInfo.name, status),
      });
    } catch (emailErr) {
      console.warn("Failed to send status update email:", emailErr);
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function adminCreateOrder(formData: {
  customerInfo: { name: string; email: string; phone: string; address: string };
  items: { productId: string; size: string; quantity: number; priceAtPurchase: number }[];
  totalAmount: number;
  paymentMethod?: string;
}) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) throw new Error("Unauthorized access.");

  await dbConnect();
  try {
    const newOrder = await Order.create({
      customerInfo: formData.customerInfo,
      items: formData.items,
      totalAmount: formData.totalAmount,
      paymentMethod: formData.paymentMethod || "COD",
      orderStatus: "Pending",
    });

    const itemDetails = await Promise.all(
      formData.items.map(async (item) => {
        const p = await Product.findById(item.productId);
        return {
          title: p ? p.title : "Product",
          size: item.size,
          quantity: item.quantity,
          price: item.priceAtPurchase,
        };
      })
    );

    try {
      await sendEmail({
        to: formData.customerInfo.email,
        subject: `Order Confirmed - REF-${newOrder._id.toString().substring(newOrder._id.toString().length - 8)}`,
        html: buildOrderConfirmationHtml(
          newOrder._id.toString(),
          formData.customerInfo,
          itemDetails,
          formData.totalAmount
        ),
      });
    } catch (emailErr) {
      console.warn("Failed to send user confirmation email:", emailErr);
    }

    try {
      await sendEmail({
        to: ADMIN_EMAIL,
        subject: `New WhatsApp Order - REF-${newOrder._id.toString().substring(newOrder._id.toString().length - 8)}`,
        html: buildAdminNotificationHtml(
          newOrder._id.toString(),
          formData.customerInfo,
          itemDetails,
          formData.totalAmount
        ),
      });
    } catch (emailErr) {
      console.warn("Failed to send admin notification email:", emailErr);
    }

    revalidatePath("/admin/orders");
    revalidatePath("/admin/dashboard");
    return { success: true, orderId: newOrder._id.toString() };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create order." };
  }
}

export async function adminGetInquiries() {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) throw new Error("Unauthorized access.");

  await dbConnect();
  const items = await Inquiry.find({}).sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(items));
}

export async function adminToggleInquiryStatus(inquiryId: string) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) throw new Error("Unauthorized access.");

  await dbConnect();
  try {
    const inquiry = await Inquiry.findById(inquiryId);
    if (!inquiry) return { success: false, error: "Inquiry not found" };
    inquiry.status = inquiry.status === "Unread" ? "Read" : "Unread";
    await inquiry.save();
    return { success: true, status: inquiry.status };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function adminDeleteInquiry(inquiryId: string) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) throw new Error("Unauthorized access.");

  await dbConnect();
  try {
    const inquiry = await Inquiry.findByIdAndDelete(inquiryId);
    if (!inquiry) return { success: false, error: "Inquiry not found" };
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function adminSaveSetting(key: string, value: any) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) throw new Error("Unauthorized access.");

  await dbConnect();
  try {
    await Setting.findOneAndUpdate(
      { key },
      { key, value },
      { upsert: true, new: true }
    );
    revalidatePath("/about");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function adminGetStats() {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) throw new Error("Unauthorized access.");

  await dbConnect();
  const productsCount = await Product.countDocuments();
  const orders = await Order.find({});
  const unreadInquiries = await Inquiry.countDocuments({ status: "Unread" });

  const totalRevenue = orders
    .filter((o) => o.orderStatus === "Completed")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  return {
    productsCount,
    ordersCount: orders.length,
    unreadInquiries,
    totalRevenue,
  };
}

// --- DATABASE AUTO-SEEDER ---
export async function seedDatabase() {
  await dbConnect();

  // 1. Check if Category already has items
  const catCount = await Category.countDocuments();
  if (catCount > 0) return { success: true, message: "Database already populated." };

  console.log("Seeding Database...");

  // Seed Categories
  const topsCategory = await Category.create({ name: "Tops" });
  const bottomsCategory = await Category.create({ name: "Bottoms" });
  const outerwearCategory = await Category.create({ name: "Outerwear" });
  const accessoriesCategory = await Category.create({ name: "Accessories" });

  // Seed settings
  await Setting.create([
    {
      key: "about_cms",
      value: {
        manifesto: "WE CRAFT THE VANGUARD. WE ARE THE DARKNESS. NO BRANDS. JUST APPAREL.",
        history: "BLVCK was established in 2026 as an architectural reaction to traditional visual weight. We focus exclusively on carbon-dense premium breathable apparel that conforms to the human shape. Engineered for comfort, finished in deep absolute matte black.",
        team: [
          { name: "K. VAN DER WEYDEN", role: "CHIEF TEXTILE ARCHITECT" },
          { name: "M. NOIR", role: "CREATIVE & BRAND DIRECTOR" },
          { name: "S. THAKUR", role: "PRINCIPAL DEVELOPER" }
        ]
      }
    },
    {
      key: "socials_cms",
      value: {
        instagram: "https://instagram.com/blvck",
        twitter: "https://twitter.com/blvck",
        youtube: "https://youtube.com/blvck"
      }
    },
    {
      key: "contacts_cms",
      value: {
        phone: "+919876543210",
        email: "concierge@blvck.com",
        address: "71 Carbon Square, Sector Dark, New Delhi, India"
      }
    }
  ]);

  // Seed Blogs
  await Blog.create([
    {
      title: "THE ANATOMY OF DEEP MATTE CARBON APPAREL",
      slug: "anatomy-of-matte-carbon-apparel",
      excerpt: "Unveiling the molecular structure of our breathable matte-black fabrics and the science of absolute light absorption.",
      content: `## The Quest for Absolute Black
Traditional apparel uses dye that reflects up to 10% of ambient light. Our proprietary **Carbon-Dense Weave** absorbs 99.2% of ambient light, rendering a pure matte shadow effect.

### Material Engineering
Every yarn is composed of 100% Breathable Interlock Matte Cotton combined with elastic core threads.
- **Breathability**: 120g/m² airflow metrics.
- **Durability**: Anti-wash fading.
- **Comfort**: Seamless thermal stitching.

### Future Perspectives
Our development lab continues to pushes the boundaries of performance and style.`,
      featuredImage: ""
    },
    {
      title: "AVANT-GARDE COUTURE: THE SILENT REVOLUTION",
      slug: "avant-garde-couture-silent-revolution",
      excerpt: "Why removing logos and brand noise creates a powerful personal statement of visual weight and styling presence.",
      content: `## Power in Silence
When branding is removed, only the form remains. We build shapes, lines, and textures that stand on their own merit.

- **Silhouette Focus**: Tailored fits that move naturally.
- **Zero Logos**: Pure visual cleanliness.
- **Deep Monochromatic Themes**: Harmonious aesthetic density.`,
      featuredImage: ""
    }
  ]);

  // Seed Products
  const mockProducts = [
    {
      title: "MATTE CARBON BREATHABLE HOODIE",
      description: "Architecturally cut pullover hoodie. Constructed using 100% breathable Interlock Matte Cotton. Finished in Absolute Charcoal Black. Tailored high-elasticity side vents, deep structural double-layered hood.",
      originalPrice: 249.00,
      sellingPrice: 189.00,
      sizes: [
        { size: "S", stock: 12 },
        { size: "M", stock: 15 },
        { size: "L", stock: 8 },
        { size: "XL", stock: 4 },
        { size: "XXL", stock: 0 }
      ],
      gender: "Unisex",
      category: outerwearCategory._id,
      images: [
        "https://ik.imagekit.io/demo/medium_cafe_bazaar_react_js_goodies.jpeg", // Mock placeholder endpoint
      ],
      imageFileIds: [],
      specs: {
        brand: "PREMIUM BLVCK LABELS",
        type: "PULLOVER HOODIE",
        sleeve: "LONG SLEEVE WITH RIBBED CUFFS",
        fit: "TAILORED RELAXED LUXURY FIT",
        fabric: "100% Breathable Interlock Matte Cotton",
        pattern: "CARBON-DENSE MONOCHROMATIC SHADOW"
      },
      isBestseller: true
    },
    {
      title: "DEEP BLACK COUTURE INTERLOCK TEE",
      description: "An elegant, heavyweight t-shirt featuring our unique high-elasticity knit pattern. Superior micro-ventilation prevents heat trap. Handcrafted double hem seams.",
      originalPrice: 120.00,
      sellingPrice: 89.00,
      sizes: [
        { size: "S", stock: 8 },
        { size: "M", stock: 20 },
        { size: "L", stock: 18 },
        { size: "XL", stock: 10 },
        { size: "XXL", stock: 5 }
      ],
      gender: "Men",
      category: topsCategory._id,
      images: [],
      imageFileIds: [],
      specs: {
        brand: "PREMIUM BLVCK LABELS",
        type: "HEAVYWEIGHT TEE",
        sleeve: "SHORT SLEEVE DEEP SET",
        fit: "TIGHT-TAILORED SHOULDER BOX-FIT HEM",
        fabric: "95% Premium Compact Cotton, 5% Elasthan",
        pattern: "PURE MATTE CARBON"
      },
      isBestseller: true
    },
    {
      title: "STRUCTURAL DEEP SHADOW SWEATSHIRT",
      description: "Minimalist mock-neck crewneck sweatshirt. Features thermal lining and a premium matte texture. Elegant structured sleeve seams create a sharp shoulder posture.",
      originalPrice: 199.00,
      sellingPrice: 149.00,
      sizes: [
        { size: "S", stock: 5 },
        { size: "M", stock: 0 },
        { size: "L", stock: 12 },
        { size: "XL", stock: 7 },
        { size: "XXL", stock: 2 }
      ],
      gender: "Men",
      category: topsCategory._id,
      images: [],
      imageFileIds: [],
      specs: {
        brand: "PREMIUM BLVCK LABELS",
        type: "CREWNECK SWEATSHIRT",
        sleeve: "RAGLAN COUTURE SLEEVE",
        fit: "STRUCTURAL LUXURY POSTURE",
        fabric: "90% Interlock Cotton, 10% Micro-Thermal Fleece",
        pattern: "DEEP MATTE MATRIC"
      },
      isBestseller: false
    },
    {
      title: "HIGH-ELASTICITY CARBON LOUNGE JOGGERS",
      description: "Tapered joggers with discrete side pockets and internal drawstring. Engineered with breathable performance weave that holds structure after repeat washes.",
      originalPrice: 180.00,
      sellingPrice: 129.00,
      sizes: [
        { size: "S", stock: 10 },
        { size: "M", stock: 12 },
        { size: "L", stock: 14 },
        { size: "XL", stock: 5 },
        { size: "XXL", stock: 3 }
      ],
      gender: "Unisex",
      category: bottomsCategory._id,
      images: [],
      imageFileIds: [],
      specs: {
        brand: "PREMIUM BLVCK LABELS",
        type: "LOUNGE JOGGERS",
        sleeve: "N/A",
        fit: "TAPERED SLIM FIT JOGGER",
        fabric: "80% Mercerized Cotton, 15% Nylon, 5% Spandex",
        pattern: "SOLID ABSOLUTE MATTE BLACK"
      },
      isBestseller: true
    },
    {
      title: "MATTE BLACK ASYMMETRICAL LUXURY DRESS",
      description: "Avant-garde draped dress featuring an asymmetrical hem and subtle cowl neck. Breathable performance yarn provides elegant weight, drape, and visual length.",
      originalPrice: 320.00,
      sellingPrice: 249.00,
      sizes: [
        { size: "S", stock: 6 },
        { size: "M", stock: 8 },
        { size: "L", stock: 4 },
        { size: "XL", stock: 0 },
        { size: "XXL", stock: 0 }
      ],
      gender: "Women",
      category: topsCategory._id,
      images: [],
      imageFileIds: [],
      specs: {
        brand: "PREMIUM BLVCK LABELS",
        type: "DRAPED DRESS",
        sleeve: "SLEEVELESS ASYMMETRICAL",
        fit: "FLOWING COUTURE OVERLAY",
        fabric: "100% Breathable Lyocell Shadow Knit",
        pattern: "MATTE MONOCHROME"
      },
      isBestseller: false
    },
    {
      title: "VANGUARD CARBON OVERCOAT",
      description: "A premium double-breasted overcoat featuring heavy wool-silk blends with deep light absorption performance. Minimal visible buttons, tailored deep pockets.",
      originalPrice: 499.00,
      sellingPrice: 389.00,
      sizes: [
        { size: "S", stock: 3 },
        { size: "M", stock: 5 },
        { size: "L", stock: 6 },
        { size: "XL", stock: 2 },
        { size: "XXL", stock: 1 }
      ],
      gender: "Unisex",
      category: outerwearCategory._id,
      images: [],
      imageFileIds: [],
      specs: {
        brand: "PREMIUM BLVCK LABELS",
        type: "TRENCH OVERCOAT",
        sleeve: "LONG SLEEVE FORMAL SET",
        fit: "SHARP TAILORED BOX SHOULDER",
        fabric: "70% Premium Matte Wool, 20% Carbon Silk, 10% Cashmere",
        pattern: "MATTE SATIN BLACK SHADOW"
      },
      isBestseller: true
    }
  ];

  await Product.create(mockProducts);
  console.log("Seed complete.");
  return { success: true, message: "Seeded categories, settings, blogs, and products successfully." };
}
