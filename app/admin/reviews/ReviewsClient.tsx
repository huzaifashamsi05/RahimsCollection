"use client";

import { useState } from "react";
import { Review } from "@/types/review";
import { saveReview, deleteReview } from "@/lib/actions/reviews";
import Button from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

export default function ReviewsClient({ initialReviews }: { initialReviews: Review[] }) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [isEditing, setIsEditing] = useState(false);
  const [currentReview, setCurrentReview] = useState<Partial<Review>>({});
  const [isSaving, setIsSaving] = useState(false);

  const supabase = createClient();

  const handleEdit = (review: Review) => {
    setCurrentReview(review);
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setCurrentReview({ author_name: "", content: "", is_published: true, image_url: null });
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    const res = await deleteReview(id);
    if (res.success) {
      setReviews(reviews.filter(r => r.id !== id));
    } else {
      alert("Error deleting review: " + res.error);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const res = await saveReview(currentReview as any);
    if (res.success) {
      window.location.reload(); // Quick refresh for now
    } else {
      alert("Error saving review: " + res.error);
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
    const filePath = `reviews/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file);

    if (uploadError) {
      alert("Error uploading image: " + uploadError.message);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    setCurrentReview({ ...currentReview, image_url: publicUrl });
  };

  if (isEditing) {
    return (
      <div className="bg-white p-6 rounded border border-charcoal/10 shadow-sm max-w-2xl">
        <h2 className="font-serif text-2xl text-charcoal mb-6">{currentReview.id ? "Edit Review" : "Add Review"}</h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-charcoal/60 mb-2">Customer Name</label>
            <input required type="text" value={currentReview.author_name} onChange={e => setCurrentReview({ ...currentReview, author_name: e.target.value })} className="w-full bg-charcoal/5 border border-charcoal/10 rounded px-4 py-2 text-charcoal focus:outline-none focus:border-gold" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-charcoal/60 mb-2">Review Content</label>
            <textarea required rows={4} value={currentReview.content} onChange={e => setCurrentReview({ ...currentReview, content: e.target.value })} className="w-full bg-charcoal/5 border border-charcoal/10 rounded px-4 py-2 text-charcoal focus:outline-none focus:border-gold" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-charcoal/60 mb-2">Customer Photo (Optional)</label>
            {currentReview.image_url ? (
              <div className="relative w-24 h-24 mb-2">
                <Image src={currentReview.image_url} alt="Review" fill className="object-cover rounded" />
                <button type="button" onClick={() => setCurrentReview({ ...currentReview, image_url: null })} className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full text-xs">×</button>
              </div>
            ) : (
              <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full bg-charcoal/5 border border-charcoal/10 rounded px-4 py-2 text-charcoal" />
            )}
          </div>
          <label className="flex items-center gap-2 cursor-pointer pt-2">
            <input type="checkbox" checked={currentReview.is_published} onChange={e => setCurrentReview({ ...currentReview, is_published: e.target.checked })} className="w-5 h-5 accent-gold" />
            <span className="font-medium text-charcoal">Publish to Website</span>
          </label>
          <div className="flex gap-4 pt-6">
            <Button type="submit" variant="primary" disabled={isSaving}>{isSaving ? "Saving..." : "Save Review"}</Button>
            <Button type="button" variant="secondary" onClick={() => setIsEditing(false)} disabled={isSaving}>Cancel</Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-serif text-xl text-charcoal">All Reviews ({reviews.length})</h2>
        <Button variant="primary" onClick={handleAddNew}>+ Add New Review</Button>
      </div>

      <div className="bg-white rounded border border-charcoal/10 overflow-hidden">
        <table className="w-full text-left font-sans text-sm">
          <thead className="bg-charcoal/5 text-charcoal/60 uppercase tracking-wider text-[11px] border-b border-charcoal/10">
            <tr>
              <th className="px-6 py-4 font-medium">Customer</th>
              <th className="px-6 py-4 font-medium">Review</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal/5">
            {reviews.map(review => (
              <tr key={review.id} className="hover:bg-charcoal/[0.02] transition-colors">
                <td className="px-6 py-4 font-medium text-charcoal flex items-center gap-3">
                  {review.image_url ? (
                    <div className="w-8 h-8 relative rounded-full overflow-hidden shrink-0"><Image src={review.image_url} alt="" fill className="object-cover" /></div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-charcoal/10 flex items-center justify-center shrink-0 text-charcoal/50 text-xs">{review.author_name[0]}</div>
                  )}
                  {review.author_name}
                </td>
                <td className="px-6 py-4 text-charcoal/70 max-w-xs truncate">{review.content}</td>
                <td className="px-6 py-4">
                  {review.is_published ? (
                    <span className="text-green-600 bg-green-50 px-2 py-1 rounded text-xs">Published</span>
                  ) : (
                    <span className="text-charcoal/50 bg-charcoal/5 px-2 py-1 rounded text-xs">Hidden</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right space-x-4">
                  <button onClick={() => handleEdit(review)} className="text-gold hover:underline">Edit</button>
                  <button onClick={() => handleDelete(review.id)} className="text-red-500 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
            {reviews.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-charcoal/50">No reviews found. Add one!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
