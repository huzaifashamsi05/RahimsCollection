import { getReviews } from "@/lib/queries/reviews";
import Image from "next/image";

export const metadata = {
  title: "Client Diaries & Reviews | Rahim's Collection",
  description: "See what our clients are saying about Rahim's Collection. Authentic reviews and client diaries.",
};

export default async function StorefrontReviewsPage() {
  const reviews = await getReviews(true);

  return (
    <div className="min-h-screen bg-cream py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h1 className="font-serif text-4xl sm:text-5xl text-charcoal">Client Diaries</h1>
          <p className="font-sans text-lg text-charcoal/70">
            The truest measure of our craftsmanship is the love and trust of our clients. Explore their experiences with Rahim&apos;s Collection.
          </p>
        </div>

        {/* Masonry-style Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-luxury p-8 shadow-sm border border-charcoal/5 flex flex-col gap-6 transition-transform hover:-translate-y-1 duration-300">
              
              {/* Stars */}
              <div className="flex gap-1 text-gold">
                {[1,2,3,4,5].map(i => (
                  <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>

              {/* Content */}
              <p className="font-sans text-charcoal/80 leading-relaxed italic text-lg">
                &ldquo;{review.content}&rdquo;
              </p>

              {/* Author Info */}
              <div className="flex items-center gap-4 mt-auto pt-6 border-t border-charcoal/10">
                {review.image_url ? (
                  <div className="w-12 h-12 relative rounded-full overflow-hidden shadow-sm shrink-0">
                    <Image src={review.image_url} alt={review.author_name} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                    <span className="font-serif text-xl text-gold">{review.author_name[0]}</span>
                  </div>
                )}
                <div className="font-sans">
                  <div className="font-semibold text-charcoal">{review.author_name}</div>
                  <div className="text-xs text-charcoal/50 uppercase tracking-wider">Verified Buyer</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {reviews.length === 0 && (
          <div className="text-center py-20 text-charcoal/50 font-serif text-xl">
            Check back soon for new client stories.
          </div>
        )}

      </div>
    </div>
  );
}
