import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import AddMealWithModal from '../../../components/AddMealWithModal';
import { useUpcomingMeals } from '../../../hooks/useUpcomingMeals';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import MealCard from '../../../components/MealCard';

const UpcomingMeals = () => {
    const { pathname } = useLocation();
    const axiosSecure = useAxiosSecure();

    const { data: upcomingMeals, isLoading, error, refetch } = useUpcomingMeals();

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddMealClick = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const queryClient = useQueryClient();

    // Mutation to publish a meal
    const publishMeal = useMutation({
        mutationFn: async (id) => {
            const response = await axiosSecure.post(`/publish-meal/${id}`);
            return response.data;
        },
        onSuccess: () => {
            Swal.fire({
                icon: 'success',
                title: 'Meal Published!',
                text: 'The meal has been successfully published.',
            });
            queryClient.invalidateQueries(['upcomingMeals']);
        },
    });

    const handlePublishClick = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to publish this meal?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, publish it!',
            cancelButtonText: 'No, cancel!',
        }).then((result) => {
            if (result.isConfirmed) {
                publishMeal.mutate(id);
            }
        });
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <>
            {pathname === "/dashboard/upcomingmeals" ?
                (
                    <div>
                        <h1 className="text-2xl font-bold">Upcoming Meals</h1>

                        <div className="overflow-x-auto">
                            <table className="table w-full">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Title</th>
                                        <th>Category</th>
                                        <th>Reaction Count</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {upcomingMeals
                                        .sort((a, b) => b.reaction - a.reaction) // Sort by reaction count
                                        .map((meal, index) => (
                                            <tr key={meal._id}>
                                                <td>{index + 1}</td>
                                                <td>{meal.title}</td>
                                                <td>{meal.category}</td>
                                                <td>{meal.reaction}</td>
                                                <td>
                                                    <button
                                                        className="btn btn-primary"
                                                        onClick={() => handlePublishClick(meal._id)}
                                                        disabled={publishMeal.isLoading}
                                                    >
                                                        Publish
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>

                        <button
                            className="btn btn-primary mt-4"
                            onClick={handleAddMealClick}
                        >
                            Add Meal
                        </button>

                        {/* Conditionally render the AddMealWithModal */}
                        {isModalOpen && (
                            <AddMealWithModal
                                closeModal={closeModal}
                                refetch={refetch}
                            />
                        )}
                    </div>
                ) : (
                    <div className='max-w-7xl mx-auto my-4'>
                        <div className='grid grid-cols-3 gap-6'>
                            {
                                upcomingMeals.map(meal => <MealCard key={meal._id} meal={meal}></MealCard>)
                            }
                        </div>
                    </div>
                )}
        </>
    );
};

export default UpcomingMeals;
