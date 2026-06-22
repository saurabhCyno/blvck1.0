import { adminGetReviews } from "@/app/actions";
import ReviewsClient from "./ReviewsClient";

export const revalidate = 0; // Ensure admin reviews load fresh metrics

export default async function AdminReviewsPage() {
  const reviews = await adminGetReviews();

  return <ReviewsClient initialReviews={reviews} />;
}
