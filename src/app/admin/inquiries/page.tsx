import { adminGetInquiries } from "@/app/actions";
import InquiriesClient from "./InquiriesClient";

export const revalidate = 0; // Ensure admin inquiries load fresh metrics

export default async function AdminInquiriesPage() {
  const inquiries = await adminGetInquiries();

  return <InquiriesClient initialInquiries={inquiries} />;
}
