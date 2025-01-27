import React, { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AuthContext } from '../../../providers/AuthProvider';
import axios from 'axios';

const fetchReviewsByEmail = async (email) => {
  const response = await axios.get(`https://hostel-management-server-orcin.vercel.app/reviews/${email}`, { withCredentials: true });
  return response.data;
};

const MyReviews = () => {
  const { user } = useContext(AuthContext);
  const userEmail = user?.email;

  const { data: reviews = [], isLoading, error } = useQuery({
    queryKey: ['reviews', userEmail],
    queryFn: () => fetchReviewsByEmail(userEmail),
    enabled: !!userEmail,
  });

  console.log(reviews);

  const handleEdit = (reviewId) => {
    console.log(`Edit review: ${reviewId}`);
    // Add edit logic here
  };

  const handleDelete = (reviewId) => {
    console.log(`Delete review: ${reviewId}`);
    // Add delete logic here
  };

  const handleViewMeal = (mealId) => {
    console.log(`View meal: ${mealId}`);
    // Redirect or view logic here
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!reviews.length) {
    return <div className='text-center my-80 text-xl'>No reviews found!</div>;
  }

  return (
    <div className="my-reviews max-w-5xl mx-auto p-6 bg-white border rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center">My Reviews</h2>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-300 p-4">Meal Title</th>
              <th className="border border-gray-300 p-4">Likes</th>
              <th className="border border-gray-300 p-4">Review</th>
            </tr>
          </thead>
          <tbody className='text-center'>
            {reviews.map((review) => (
              <tr key={review._id} className="hover:bg-gray-100">
                <td className="border border-gray-300 p-4">{review.mealTitle || 'N/A'}</td>
                <td className="border border-gray-300 p-4">{review.likes || 0}</td>
                <td className="border border-gray-300 p-4">{review.review}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyReviews;
