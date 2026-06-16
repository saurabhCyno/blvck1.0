import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const FROM_EMAIL = process.env.SMTP_FROM || process.env.SMTP_USER || "noreply@blvck.com";
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || process.env.SMTP_USER || "admin@blvck.com";

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("SMTP not configured. Email not sent to", to);
    return;
  }

  await transporter.sendMail({
    from: `"BLVCK" <${FROM_EMAIL}>`,
    to,
    subject,
    html,
  });
}

function orderItemsTable(
  items: { title: string; size: string; quantity: number; price: number }[]
): string {
  const rows = items
    .map(
      (item) => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #222;color:#ccc;font-size:13px">${item.title}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #222;color:#ccc;font-size:13px">${item.size}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #222;color:#ccc;font-size:13px;text-align:center">${item.quantity}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #222;color:#fff;font-size:13px;text-align:right">₹${item.price.toFixed(2)}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #222;color:#fff;font-size:13px;text-align:right">₹${(item.price * item.quantity).toFixed(2)}</td>
    </tr>`
    )
    .join("");

  return `
    <table style="width:100%;border-collapse:collapse;margin-top:12px">
      <thead>
        <tr style="background:#111">
          <th style="padding:10px 12px;text-align:left;color:#888;font-size:11px;text-transform:uppercase;letter-spacing:1px">Item</th>
          <th style="padding:10px 12px;text-align:left;color:#888;font-size:11px;text-transform:uppercase;letter-spacing:1px">Size</th>
          <th style="padding:10px 12px;text-align:center;color:#888;font-size:11px;text-transform:uppercase;letter-spacing:1px">Qty</th>
          <th style="padding:10px 12px;text-align:right;color:#888;font-size:11px;text-transform:uppercase;letter-spacing:1px">Price</th>
          <th style="padding:10px 12px;text-align:right;color:#888;font-size:11px;text-transform:uppercase;letter-spacing:1px">Total</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>`;
}

function baseTemplate(title: string, body: string): string {
  return `
  <div style="max-width:600px;margin:0 auto;background:#0a0a0a;border:1px solid #1a1a1a;font-family:Arial,sans-serif">
    <div style="padding:32px 40px;border-bottom:1px solid #1a1a1a;text-align:center">
      <h1 style="margin:0;font-size:24px;letter-spacing:4px;color:#fff;font-weight:900">BLVCK</h1>
    </div>
    <div style="padding:32px 40px">
      <h2 style="margin:0 0 16px;font-size:16px;letter-spacing:2px;color:#fff;text-transform:uppercase">${title}</h2>
      ${body}
    </div>
    <div style="padding:20px 40px;border-top:1px solid #1a1a1a;text-align:center;font-size:11px;color:#555;letter-spacing:1px">
      COUTURE DEV. LAB &mdash; ALL RIGHTS RESERVED
    </div>
  </div>`;
}

export function buildOrderConfirmationHtml(
  orderId: string,
  customerInfo: { name: string; address: string },
  items: { title: string; size: string; quantity: number; price: number }[],
  totalAmount: number
): string {
  return baseTemplate(
    "Order Confirmed",
    `
    <p style="color:#aaa;font-size:13px;line-height:1.6">Dear ${customerInfo.name},</p>
    <p style="color:#aaa;font-size:13px;line-height:1.6">Your order has been confirmed and is being processed.</p>
    <div style="background:#111;padding:16px;margin:16px 0;border:1px solid #222">
      <p style="margin:0 0 4px;color:#888;font-size:11px;text-transform:uppercase;letter-spacing:1px">Order Reference</p>
      <p style="margin:0;color:#fff;font-size:15px;font-weight:bold;font-family:monospace">REF-${orderId.substring(orderId.length - 8)}</p>
    </div>
    <div style="background:#111;padding:16px;margin:16px 0;border:1px solid #222">
      <p style="margin:0 0 4px;color:#888;font-size:11px;text-transform:uppercase;letter-spacing:1px">Shipping Address</p>
      <p style="margin:0;color:#ccc;font-size:13px">${customerInfo.address}</p>
    </div>
    ${orderItemsTable(items)}
    <div style="margin-top:16px;padding-top:16px;border-top:1px solid #222;text-align:right">
      <span style="color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px">Total: </span>
      <span style="color:#fff;font-size:20px;font-weight:bold">₹${totalAmount.toFixed(2)}</span>
    </div>
    <p style="color:#666;font-size:12px;line-height:1.6;margin-top:24px">Payment Method: Cash on Delivery (COD)</p>
    `
  );
}

export function buildAdminNotificationHtml(
  orderId: string,
  customerInfo: { name: string; email: string; phone: string; address: string },
  items: { title: string; size: string; quantity: number; price: number }[],
  totalAmount: number
): string {
  return baseTemplate(
    "New Order Received",
    `
    <p style="color:#aaa;font-size:13px;line-height:1.6">A new order has been placed.</p>
    <div style="background:#111;padding:16px;margin:16px 0;border:1px solid #222">
      <p style="margin:0 0 4px;color:#888;font-size:11px;text-transform:uppercase;letter-spacing:1px">Order Reference</p>
      <p style="margin:0;color:#fff;font-size:15px;font-weight:bold;font-family:monospace">REF-${orderId.substring(orderId.length - 8)}</p>
    </div>
    <div style="background:#111;padding:16px;margin:16px 0;border:1px solid #222">
      <p style="margin:0 0 8px;color:#888;font-size:11px;text-transform:uppercase;letter-spacing:1px">Customer Details</p>
      <p style="margin:0;color:#ccc;font-size:13px"><strong style="color:#fff">Name:</strong> ${customerInfo.name}</p>
      <p style="margin:4px 0;color:#ccc;font-size:13px"><strong style="color:#fff">Email:</strong> ${customerInfo.email}</p>
      <p style="margin:4px 0;color:#ccc;font-size:13px"><strong style="color:#fff">Phone:</strong> ${customerInfo.phone}</p>
      <p style="margin:4px 0;color:#ccc;font-size:13px"><strong style="color:#fff">Address:</strong> ${customerInfo.address}</p>
    </div>
    ${orderItemsTable(items)}
    <div style="margin-top:16px;padding-top:16px;border-top:1px solid #222;text-align:right">
      <span style="color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px">Total: </span>
      <span style="color:#fff;font-size:20px;font-weight:bold">₹${totalAmount.toFixed(2)}</span>
    </div>
    <p style="color:#666;font-size:12px;line-height:1.6;margin-top:24px">Payment Method: Cash on Delivery (COD)</p>
    <p style="color:#666;font-size:12px;line-height:1.6">Manage this order from your <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin/orders" style="color:#fff">admin panel</a>.</p>
    `
  );
}

export function buildStatusUpdateHtml(
  orderId: string,
  customerName: string,
  newStatus: string
): string {
  const statusMessages: Record<string, string> = {
    Pending: "Your order is pending and awaiting processing.",
    "In Progress": "Your order is now being processed and prepared for dispatch.",
    Completed: "Your order has been completed and is on its way to you.",
    Delivered: "Your order has been delivered successfully. We hope you love your purchase!",
    Cancelled: "Your order has been cancelled. Please contact support for details.",
  };

  return baseTemplate(
    `Order ${newStatus.toUpperCase()}`,
    `
    <p style="color:#aaa;font-size:13px;line-height:1.6">Dear ${customerName},</p>
    <p style="color:#aaa;font-size:13px;line-height:1.6">${statusMessages[newStatus] || "Your order status has been updated."}</p>
    <div style="background:#111;padding:16px;margin:16px 0;border:1px solid #222;text-align:center">
      <p style="margin:0 0 4px;color:#888;font-size:11px;text-transform:uppercase;letter-spacing:1px">Order Reference</p>
      <p style="margin:0;color:#fff;font-size:15px;font-weight:bold;font-family:monospace">REF-${orderId.substring(orderId.length - 8)}</p>
      <div style="margin-top:12px;display:inline-block;padding:8px 24px;border:1px solid #333;background:#111">
        <span style="color:#fff;font-size:13px;letter-spacing:2px;text-transform:uppercase">${newStatus.toUpperCase()}</span>
      </div>
    </div>
    <p style="color:#666;font-size:12px;line-height:1.6;margin-top:16px">If you have any questions, please contact our concierge team.</p>
    `
  );
}
