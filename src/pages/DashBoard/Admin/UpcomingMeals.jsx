import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import AddMealWithModal from '../../../components/AddMealWithModal';
import LikeButtonUpcomingMeal from '../../../components/LikeButtonUpcomingMeal';
import SectionHeading from '../../../components/SectionHeading';
import ReactStars from 'react-rating-stars-component';
import { FcLike } from "react-icons/fc";
import { AuthContext } from '../../../providers/AuthProvider';
import usePremiumMember from '../../../hooks/usePremiumMember';
import { BiSolidLike } from "react-icons/bi";

const UpcomingMeals = () => {
    const { pathname } = useLocation();
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const [upcomingMealsCount, setUpcomingMealsCount] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {PremiumMember} = usePremiumMember();
    const {notificationCount, setNotificationCount} = useContext(AuthContext);


    const closeModal = () => setIsModalOpen(false);

    console.log("He is a premium Member", PremiumMember);

    useEffect(() => {
        const fetchCount = async () => {
            const response = await axiosSecure.get('/upcomingmealscount');
            setUpcomingMealsCount(response.data.count);
        };
        fetchCount();
    }, [axiosSecure]);

    const numberOfPages = Math.ceil(upcomingMealsCount / itemsPerPage);
    const pages = [...Array(numberOfPages).keys()];

    const { data: upcomingMeals = [], isLoading, refetch } = useQuery({
        queryKey: ['upcomingmeals', { currentPage, itemsPerPage }],
        queryFn: async ({ queryKey }) => {
            const [, { currentPage, itemsPerPage }] = queryKey;
            const response = await axiosSecure.get(
                `/upcomingmeals?page=${currentPage - 1}&size=${itemsPerPage}`
            );
            return response.data;
        },
        
        refetchOnWindowFocus: false, 
    });


    const { data: upcomingMealsAll = [], isLoading: isLoadingAllUpcoming, refetch: refetchAllUpcoming } = useQuery({
        queryKey: ['upcomingmealsall'], 
        queryFn: async () => {
            const response = await axiosSecure.get(`/upcomingmealsall`); 
            return response.data;
        },
        
        refetchOnWindowFocus: false, 
    });


    const incrementNotification = () => {
        setNotificationCount((prevCount) => prevCount + 1);
    };

    console.log("total Notifications", notificationCount);


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
            incrementNotification();
            queryClient.invalidateQueries(['upcomingmeals']);
            refetch(); 
        },
    });

    const handleReactionUpdate = (meal, newReactionCount) => {
        if (newReactionCount === 10) {
            publishMeal.mutate(meal._id);
        }
    };

    const handleItemsPerPage = (e) => {
        setItemsPerPage(parseInt(e.target.value, 10));
        setCurrentPage(1);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < numberOfPages) setCurrentPage(currentPage + 1);
    };


    return (
        <div className="max-w-7xl mx-auto">
            <SectionHeading title="Upcoming Meals"></SectionHeading>
            {isModalOpen && <AddMealWithModal closeModal={closeModal} refetch={refetch} />}

            {pathname === '/dashboard/upcomingmeals' ? (
                <>

                    <div className="flex flex-col h-full">
                        
                        <div className="h-[500px] overflow-x-auto">
                            <table className="table w-full">
                                <thead className='text-center'>
                                    <tr>
                                        <th>#</th>
                                        <th>Title</th>
                                        <th>Category</th>
                                        <th>Reaction Count</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {upcomingMeals.map((meal, index) => (
                                        <tr key={meal._id}>
                                            <td>{index + 1}</td>
                                            <td>{meal.title}</td>
                                            <td>{meal.category}</td>
                                            <td>{meal.reaction?.count}</td>
                                            <td>
                                                <button
                                                    className="btn btn-success"
                                                    onClick={() => publishMeal.mutate(meal._id)}
                                                >
                                                    Publish
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Add Meal Button */}
                        <div className="mt-4">
                            <button
                                className="btn btn-primary"
                                onClick={() => setIsModalOpen(true)}
                            >
                                Add Meal
                            </button>
                        </div>

                        <div className="sticky bottom-0 bg-white border-t mt-4 flex justify-center gap-2 py-2">
                            <button
                                className="btn btn-secondary"
                                disabled={currentPage === 1}
                                onClick={handlePrevPage}
                            >
                                Previous
                            </button>
                            {pages.map((page) => (
                                <button
                                    key={page}
                                    className={`btn ${currentPage === page + 1 ? "btn-active" : "btn-outline"
                                        }`}
                                    onClick={() => setCurrentPage(page + 1)}
                                >
                                    {page + 1}
                                </button>
                            ))}
                            <button
                                className="btn btn-secondary"
                                disabled={currentPage === numberOfPages}
                                onClick={handleNextPage}
                            >
                                Next
                            </button>
                        </div>
                    </div>

                </>
            ) : (
                <div className="grid grid-cols-1 mb-6 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {upcomingMealsAll.map((meal) => (
                        <>
                            <div className="card border border-gray-400 w-[95%] mx-auto">
                                <figure className="relative">
                                    <img
                                        className="h-80 w-full transition-transform duration-300 group-hover:scale-110" // Scale on hover
                                        src={meal?.image}
                                        alt="Meal"
                                    />
                                </figure>
                                <div className='flex justify-between'>
                                    <div className="flex gap-1 items-center justify-center">
                                        {
                                            PremiumMember ? (<div className="">
                                                <LikeButtonUpcomingMeal
                                                    meal={meal}
                                                    userEmails={meal.reaction?.userEmails || []}
                                                    initialReaction={meal.reaction?.count || 0}
                                                    refetchAllUpcoming={refetchAllUpcoming}
                                                    onReactionUpdate={(newCount) =>
                                                        handleReactionUpdate(meal, newCount)
                                                    }
                                                />
                                            </div>) : (<BiSolidLike className='text-gray-200'></BiSolidLike>)
                                        }
                                        <p>{meal?.reaction?.count}</p>
                                    </div>
                                    <div className="flex justify-end gap-2 items-center">
                                        <p>{meal?.rating?.toFixed(1)}</p>
                                        <div>
                                            <ReactStars
                                                key={meal?.rating}
                                                count={5}
                                                value={meal?.rating}
                                                size={20}
                                                edit={false}
                                                activeColor="#ddd700"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <h2 className="text-center text-md font-extrabold p-8">{meal?.title}</h2>
                            </div>

                        </>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UpcomingMeals;