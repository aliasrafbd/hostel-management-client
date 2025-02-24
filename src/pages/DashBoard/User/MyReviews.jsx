import React, { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AuthContext } from '../../../providers/AuthProvider';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import useMeals from '../../../hooks/useMeals';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';

const fetchReviewsByEmail = async (email) => {
    const response = await axios.get(`https://hostel-management-server-orcin.vercel.app/reviews/${email}`, {withCredentials: true});
    return response.data;
};

const MyReviews = () => {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();
    const userEmail = user?.email;
    const navigate = useNavigate();

    const { data: reviews = [], isLoading, error, refetch } = useQuery({
        queryKey: ['reviews', userEmail],
        queryFn: () => fetchReviewsByEmail(userEmail),
        enabled: !!userEmail,
    });

    console.log(reviews);


    const handleDeleteReview = async (mealId, userEmail) => {

        console.log(mealId, userEmail);

        try {
            
            const response = await axiosSecure.delete(`/meals/${mealId}/reviews`, {
                data: { userEmail }, 
            });

            if (response.status === 200) {
                Swal.fire({
                    position: 'top',
                    icon: 'success',
                    title: 'Review deleted successfully!',
                    showConfirmButton: false,
                    timer: 1500,
                });
                refetch();

            }
        } catch (error) {
            console.error('Error deleting review:', error);
            Swal.fire({
                position: 'top',
                icon: 'error',
                title: 'Failed to delete review',
                text: 'Please try again later.',
                showConfirmButton: true,
            });
        } finally {
        };

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
                            <th className="border border-gray-300 p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className='text-center'>
                        {reviews.map((review) => (
                            <tr key={review._id} className="hover:bg-gray-100">
                                <td className="border border-gray-300 p-4">{review.mealTitle || 'N/A'}</td>
                                <td className="border border-gray-300 p-4">{review.likes || 0}</td>
                                <td className="border border-gray-300 p-4">{review.review}</td>
                                <td className="border border-gray-300 p-4 space-x-2 flex items-center justify-center">
                                    <button
                                        className="btn btn-sm btn-info text-white"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteReview(review._id, review?.userEmail)}
                                        className="btn btn-sm btn-danger"
                                    >
                                        Delete
                                    </button>
                                    <Link to={`/meal/${review?._id}`}><button
                                        className="btn btn-info btn-sm mr-2"
                                    >
                                        View Meal
                                    </button></Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MyReviews;
