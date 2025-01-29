import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import useAxiosSecure from '../hooks/useAxiosSecure';
import { Link, useLoaderData } from 'react-router-dom';
import axios from 'axios';

const MealsTable = () => {
    const axiosSecure = useAxiosSecure();
    const [sortBy, setSortBy] = useState('reaction'); 

    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [currentPage, setCurrentPage] = useState(0)

    const { count } = useLoaderData();
    console.log(count);
    const numberOfPages = Math.ceil(count / itemsPerPage);

    const pages = [...Array(numberOfPages).keys()];

    const { data: meals = [], isLoading, isError, error, refetch } = useQuery({
        queryKey: ['meals', { sortBy, currentPage, itemsPerPage }], 
        queryFn: async ({ queryKey }) => {
            const [, { sortBy, page, size }] = queryKey; 
            const response = await axios.get(`https://hostel-management-server-orcin.vercel.app/mealssorted?sort=${sortBy}&page=${currentPage}&size=${itemsPerPage}`);
            return response.data;
        },
        staleTime: 10000, 
        refetchOnWindowFocus: false, 
        enabled: !!sortBy && currentPage !== undefined && itemsPerPage !== undefined, 
    });


    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        console.error('Error fetching meals:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to load meals!',
        });
        return null;
    }


    const handleUpdate = (id) => {
        Swal.fire('Update functionality will go here!', `Meal ID: ${id}`, 'info');
    };


    const handleItemsPerPage = e => {
        setItemsPerPage(parseInt(e.target.value));
        setCurrentPage(0)
    }

    const handlePrevPage = e => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1)
        }
    }

    const handleNextPage = e => {
        if (currentPage < pages.length - 1) {
            setCurrentPage(currentPage + 1)
        }
    }


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
                    await axios.delete(`https://hostel-management-server-orcin.vercel.app/mealssorted/${id}`);
                    Swal.fire('Deleted!', 'The meal has been deleted.', 'success');
                    refetch(); 
                } catch (err) {
                    Swal.fire('Error', 'Failed to delete the meal.', 'error');
                }
            }
        });
    };

    return (
        <div className="my-6">
            <div className="mb-4">
                <label className="mr-2">Sort By:</label>
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)} 
                    className="select select-bordered"
                >
                    <option value="reaction">Likes</option>
                    <option value="reviews">Review Count</option>
                </select>
            </div>
            <div className='overflow-x-auto lg:overflow-x-hidden h-[600px]'>
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Title</th>
                            <th>Likes</th>
                            <th>Review Count</th>
                            <th>Distributor</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {meals.map((meal, index) => (
                            <tr key={meal._id}>
                                <td>{index + 1}</td>
                                <td>{meal.title}</td>
                                <td>{meal?.reaction?.count}</td>
                                <td>{meal?.reviews?.review_count}</td>
                                <td>{meal.distributorName || 'N/A'}</td>
                                <td className='flex'>
                                    <Link to={`/meal/${meal._id}`}><button
                                        className="btn btn-info btn-sm mr-2"
                                        onClick={() => handleViewMeal(meal._id)}
                                    >
                                        View Meal
                                    </button></Link>

                                    <Link to={`/dashboard/meals/${meal._id}`}>
                                        <button
                                            className="btn btn-warning btn-sm mr-2"
                                        // onClick={() => handleUpdate(meal._id)}
                                        >
                                            Update
                                        </button>
                                    </Link>
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


            <div className='pagination flex items-center mb-8 justify-center gap-4'>
                <button className='btn btn-secondary' onClick={handlePrevPage}>Previous</button>
                <div className='text-xl flex gap-2'>
                    {
                        pages.map(page => <button
                            className={currentPage === page && `selected`}
                            onClick={() => setCurrentPage(page)}
                        >{page}</button>)
                    }
                </div>
                <button className='btn btn-secondary' onClick={handleNextPage}>Next</button>
            </div>

        </div>
    );
};

export default MealsTable;