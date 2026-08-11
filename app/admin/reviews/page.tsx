import { getReviews } from "@/lib/queries/reviews";
import ReviewsClient from "./ReviewsClient";

export const metadata = {
  title: "Admin — Reviews | Rahim's Collection",
};

export default async function ReviewsPage() {
  const reviews = await getReviews();
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-charcoal">Customer Reviews</h1>
        <p className="text-charcoal/60 mt-2 font-sans">Manage customer testimonials and reviews shown on the website.</p>
      </div>

      <ReviewsClient initialReviews={reviews} />
    </div>
  );
}
