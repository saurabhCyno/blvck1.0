import { adminGetStats } from "@/app/actions";
import { Shirt, ClipboardList, Inbox, DollarSign } from "lucide-react";

export const revalidate = 0; // Ensure admin analytical states load fresh metrics

export default async function AdminDashboardPage() {
  const stats = await adminGetStats();

  const metrics = [
    {
      name: "TOTAL REVENUE",
      value: `₹${stats.totalRevenue.toFixed(2)}`,
      description: "Sum of completed orders",
      icon: DollarSign,
    },
    {
      name: "ORDER VOLUME",
      value: stats.ordersCount.toString(),
      description: "Total orders processed",
      icon: ClipboardList,
    },
    {
      name: "ACTIVE PRODUCT LABELS",
      value: stats.productsCount.toString(),
      description: "Items in catalogue database",
      icon: Shirt,
    },
    {
      name: "UNREAD INQUIRIES",
      value: stats.unreadInquiries.toString(),
      description: "Awaiting concierge response",
      icon: Inbox,
    },
  ];

  return (
    <div className="space-y-10">
      {/* Workspace Header */}
      <div className="border-b border-white/10 pb-4">
        <h1 className="font-display text-2xl font-black tracking-widest text-white uppercase">
          ANALYTICAL OVERVIEW
        </h1>
        <p className="text-white/45 text-xs font-body mt-1">
          Real-time metrics and pipeline statistics.
        </p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          const isHighAlert = metric.name === "UNREAD INQUIRIES" && stats.unreadInquiries > 0;
          
          return (
            <div
              key={metric.name}
              className={`border p-6 flex flex-col justify-between space-y-4 transition-all duration-300 ${
                isHighAlert
                  ? "border-red-500/20 bg-red-500/5"
                  : "border-white/10 bg-black hover:border-white/20"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-xs tracking-widest text-white/50">
                  {metric.name}
                </span>
                <Icon className={`h-4 w-4 ${isHighAlert ? "text-red-500" : "text-white/45"}`} />
              </div>
              <div className="space-y-1">
                <h2 className="font-display text-3xl font-black text-white tracking-widest">
                  {metric.value}
                </h2>
                <p className="text-xs text-white/40 font-body uppercase tracking-wider">
                  {metric.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info Desk Guidelines */}
      <div className="border border-white/10 bg-black p-6 space-y-4">
        <h3 className="font-display text-sm text-white tracking-widest font-black">
          ADMINISTRATIVE PROTOCOLS
        </h3>
        <p className="text-xs text-white/50 leading-relaxed font-body">
          Use the left sidebar workspace nodes to manage inventory levels, create products, configure category tags, dispatch inquiries, and update homepage CMS text structures. Ensure all images are transformations-optimized via ImageKit URL endpoints to sustain immediate client-side paint times.
        </p>
      </div>
    </div>
  );
}
