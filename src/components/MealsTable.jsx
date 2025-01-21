import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import useAxiosSecure from '../hooks/useAxiosSecure';

const MealsTable = () => {
    const axiosSecure = useAxiosSecure();
    const [sortBy, setSortBy] = useState('reaction'); // Default sorting by likes

    // Fetch meals with sorting using React Query
    const { data: meals, isLoading, isError, error, refetch } = useQuery({
        queryKey: ['meals', sortBy],
        queryFn: async () => {
            const response = await axiosSecure.get(`/mealssorted?sort=${sortBy}`);
            return response.data;
        },
        // Optional: add a stale time to minimize fetching during sorting changes
        staleTime: 5000, // 5 seconds
    });

    // Handle loading and error states
    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        console.error('Failed to fetch meals:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to load meals!',
        });
        return null; // Return null or an error message component
    }

    const handleUpdate = (id) => {
        Swal.fire('Update functionality will go here!', `Meal ID: ${id}`, 'info');
    };

    const handleDelete = (id) => {
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
                    await axiosSecure.delete(`/mealssorted/${id}`);
                    Swal.fire('Deleted!', 'The meal has been deleted.', 'success');
                    refetch(); // Refetch meals after deletion
                } catch (error) {
                    Swal.fire('Error', 'Failed to delete the meal.', 'error');
                }
            }
        });
    };

    const handleView = (id) => {
        Swal.fire('View functionality will go here!', `Meal ID: ${id}`, 'info');
    };

    return (
        <div className="overflow-x-auto">
            <h1 className="text-2xl font-bold mb-4">Meals Table</h1>
            <div className="mb-4">
                <label className="mr-2">Sort By:</label>
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="select select-bordered"
                >
                    <option value="reaction">Likes</option>
                    <option value="rating">Rating</option>
                </select>
            </div>
            <table className="table w-full">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Title</th>
                        <th>Likes</th>
                        <th>Rating</th>
                        <th>Distributor</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {meals.map((meal, index) => (
                        <tr key={meal._id}>
                            <td>{index + 1}</td>
                            <td>{meal.title}</td>
                            <td>{meal.reaction.count}</td>
                            <td>{meal.rating}</td>
                            <td>{meal.distributorName || 'N/A'}</td>
                            <td>
                                <button
                                    className="btn btn-info btn-sm mr-2"
                                    onClick={() => handleView(meal._id)}
                                >
                                    View
                                </button>
                                <button
                                    className="btn btn-warning btn-sm mr-2"
                                    onClick={() => handleUpdate(meal._id)}
                                >
                                    Update
                                </button>
                                <button
                                    className="btn btn-error btn-sm"
                                    onClick={() => handleDelete(meal._id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MealsTable;
