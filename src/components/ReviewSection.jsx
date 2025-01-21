import React, { useState } from 'react';
import { useReviews, useAddReview } from '../hooks/useReviews';

const ReviewSection = ({ mealId, userId }) => {
    const { reviews, reviewCount, isLoading, error } = useReviews(mealId);
    const addReviewMutation = useAddReview();

    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(5);

    const handlePostReview = () => {
        if (!reviewText.trim()) return;
        addReviewMutation.mutate({
            mealId,
            userId,
            reviewText,
            rating,
        });
        setReviewText('');
    };

    if (isLoading) return <div>Loading reviews...</div>;
    if (error) return <div>Error loading reviews</div>;

    return (
        <div>
            <h3>Reviews ({reviewCount})</h3>
            <div>
                {reviews.map((review) => (
                    <div key={review._id} className="review-item">
                        <p><strong>Rating:</strong> {review.rating}</p>
                        <p>{review.reviewText}</p>
                    </div>
                ))}
            </div>
            <div className="review-form">
                <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Write your review"
                />
                <select value={rating} onChange={(e) => setRating(e.target.value)}>
                    {[1, 2, 3, 4, 5].map((r) => (
                        <option key={r} value={r}>
                            {r} Star{r > 1 ? 's' : ''}
                        </option>
                    ))}
                </select>
                <button onClick={handlePostReview} disabled={addReviewMutation.isLoading}>
                    Post Review
                </button>
            </div>
        </div>
    );
};

export default ReviewSection;
