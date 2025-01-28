import React, { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { AuthContext } from '../../../providers/AuthProvider';
import SectionHeading from '../../../components/SectionHeading';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';

const fetchRequestedMeals = async (email) => {
    const response = await axios.get(`https://hostel-management-server-orcin.vercel.app/requestedmeals/${email}`, { withCredentials: true });
    return response.data.requestedMeals || [];
};

const RequestedMeals = () => {
    const { user } = useContext(AuthContext);

    const axiosSecure = useAxiosSecure();
    
    const userEmail = user?.email;

    // Destructuring useQuery response
    const { data: meals = [], isLoading, error, refetch } = useQuery({
        queryKey: ['requestedMeals', userEmail],
        queryFn: () => fetchRequestedMeals(userEmail),
        enabled: !!userEmail,
    });


    // Cancel handler
    const handleCancel = (mealId) => {
        console.log(`Cancel meal with ID: ${mealId}`);
        // Add cancellation logic here, e.g., axios.delete(...)
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error.response?.data.message || 'Failed to fetch requested meals'}</div>;
    }

    const handleDeleteReqMeal = (id) => {
            Swal.fire({
                title: 'Are you sure?',
                text: 'This action cannot be undone!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'No, cancel!',
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        await axiosSecure.delete(`/requestedmeals/${id}`);
                        Swal.fire('Deleted!', 'Requested meals has been cancel.', 'success');
                        refetch(); // Refetch meals after deletion
                    } catch (err) {
                        Swal.fire('Error', 'Failed to cancel the meal.', 'error');
                    }
                }
            });
        };


    return (
        <div className="container mx-auto p-4">
            <SectionHeading title="Requested Meals"></SectionHeading>
            <h1 className="mb-8">Your Email: {user?.email}</h1>
            <h1 className="mb-8">Your Name: {user?.displayName}</h1>
            {meals.length === 0 ? (
                <div className='text-2xl my-60 text-center text-red-500 w-[60%] p-2 mx-auto'>No requested meals found.</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="table-auto w-full border-collapse border border-gray-300">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="border border-gray-300 p-2">Meal Title</th>
                                <th className="border border-gray-300 p-2">Likes</th>
                                <th className="border border-gray-300 p-2">Reviews Count</th>
                                <th className="border border-gray-300 p-2">Status</th>
                                <th className="border border-gray-300 p-2">Action</th>
                            </tr>
                        </thead>
                        <tbody className='text-center'>
                            {meals.map((meal) => (
                                <tr key={meal._id} className="hover:bg-gray-100">
                                    <td className="border border-gray-300 p-2">{meal.title}</td>
                                    <td className="border border-gray-300 p-2">{meal.reviews?.reaction || 0}</td>
                                    <td className="border border-gray-300 p-2">{meal.reviews?.rating || 0}</td>
                                    <td className="border border-gray-300 p-2 capitalize">{meal.status || 'Pending'}</td>
                                    <td className="border border-gray-300 p-2 capitalize">
                                        <button
                                            className="btn btn-secondary btn-sm"
                                            onClick={() => handleDeleteReqMeal(meal._id)}
                                        >
                                            Cancel
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default RequestedMeals;