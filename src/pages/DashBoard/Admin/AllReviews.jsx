import React, { useContext, useState } from 'react';
import { AuthContext } from '../../../providers/AuthProvider';
import { Link, useLoaderData } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const AllReviews = () => {

    const axiosSecure = useAxiosSecure();

    const { minPrice, setMinPrice, maxPrice, setMaxPrice, category, search } = useContext(AuthContext);

    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    const { count } = useLoaderData();
    const numberOfPages = Math.ceil(count / itemsPerPage);
    const pages = [...Array(numberOfPages).keys()];

    const { data: mealsReviews = [], isLoading, error, isFetching, refetch } = useQuery({
        queryKey: ["mealstable", currentPage, itemsPerPage],
        queryFn: async ({ queryKey }) => {
            const [, currentPage, itemsPerPage] = queryKey;
            const response = await fetch(
                `http://localhost:5000/reviews?page=${currentPage}&size=${itemsPerPage}`
            );
            if (!response.ok) {
                throw new Error("Failed to fetch meals.");
            }
            return response.json();
        },
        keepPreviousData: true,
        staleTime: 5000,
        refetchOnWindowFocus: false,
    });


    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'This will reset the reviews for this meal to zero!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, reset reviews!',
            cancelButtonText: 'No, cancel!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // Update the reviews for the meal to zero
                    const updatedReviews = {
                        review_count: 0,
                        reviews: [], // Empty the reviews array
                    };
    
                    // Make API call to update the meal's reviews
                    await axiosSecure.put(`/mealssorted/${id}/reviews`, updatedReviews);
    
                    Swal.fire('Reset!', 'The reviews have been reset.', 'success');
                    refetch(); // Refetch meals after the update
                } catch (err) {
                    Swal.fire('Error', 'Failed to reset the reviews.', 'error');
                }
            }
        });
    };    

    const handleItemsPerPage = (e) => {
        setItemsPerPage(parseInt(e.target.value));
        setCurrentPage(1);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < numberOfPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handleViewMeal = (id) => {
        console.log(`View meal with ID: ${id}`);
    };

    console.log(mealsReviews);

    return (
        <>
            <div className="p-6">
                <h1 className="text-2xl text-center font-bold mb-4">Meal Reviews</h1>
                <div className="overflow-x-auto">
                    <table className="table-auto text-center w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-300 px-4 py-2">Title</th>
                                <th className="border border-gray-300 px-4 py-2">Reaction</th>
                                <th className="border border-gray-300 px-4 py-2">Review Count</th>
                                <th className="border border-gray-300 px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mealsReviews?.map((meal) => (
                                <tr key={meal._id} className="hover:bg-gray-50">
                                    <td className="border border-gray-300 px-4 py-2">{meal?.title}</td>
                                    <td className="border border-gray-300 px-4 py-2">{meal?.reaction?.count}</td>
                                    <td className="border border-gray-300 px-4 py-2">{meal?.reviews?.review_count}</td>
                                    <td className="border border-gray-300 px-4 py-2 flex justify-center gap-2">
                                        <button
                                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                            onClick={() => handleDelete(meal._id)}
                                        >
                                            Delete
                                        </button>

                                        <Link to={`/meal/${meal._id}`}><button
                                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                            onClick={() => handleViewMeal(meal._id)}
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

            <div className="flex flex-col items-center mb-8">
                <div className="mb-2">
                    <label className="mr-2">Items Per Page:</label>
                    <select
                        value={itemsPerPage}
                        onChange={handleItemsPerPage}
                        className="select select-bordered"
                    >
                        <option value="5">5</option>
                        <option value="8">8</option>
                        <option value="10">10</option>
                    </select>
                </div>
                <div className="pagination flex items-center justify-center gap-4">
                    <button
                        className={`px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 ${currentPage === 1 && 'opacity-50 cursor-not-allowed'}`}
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    {pages.map((page) => (
                        <button
                            key={page + 1}
                            className={`px-4 py-2 rounded ${currentPage === page + 1 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-800 hover:bg-gray-400'}`}
                            onClick={() => setCurrentPage(page + 1)}
                        >
                            {page + 1}
                        </button>
                    ))}
                    <button
                        className={`px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 ${currentPage === numberOfPages && 'opacity-50 cursor-not-allowed'}`}
                        onClick={handleNextPage}
                        disabled={currentPage === numberOfPages}
                    >
                        Next
                    </button>
                </div>
            </div>
        </>
    );
};

export default AllReviews;
