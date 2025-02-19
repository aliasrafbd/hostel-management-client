import { useQuery } from '@tanstack/react-query';
import React from 'react';
import Loading from './Loading';
import useAxiosSecure from '../hooks/useAxiosSecure';
import SectionHeading from './SectionHeading';

const CustomerTestimonials = () => {

    const axiosSecure = useAxiosSecure();

    const { data: meals = [], isLoading, error, isFetching, refetch } = useQuery({
        queryKey: ["meals"],
        queryFn: async ({ queryKey }) => {
            const response = await axiosSecure.get(`/allreviews`);
            return response.data;
        },
        keepPreviousData: true,
        staleTime: 5000,
        refetchOnWindowFocus: false,
    });

    if (isLoading) {
        <Loading></Loading>
    }

    console.log(meals);

    return (
        <>
            <div className='max-w-7xl mx-auto my-12'>
                <SectionHeading title="Customer Testimonials"></SectionHeading>
                <div className='grid grid-cols-3 gap-4'>
                    {
                        meals?.map(meal => <div className="p-4 border rounded shadow-lg">
                            {/* Display Title */}
                            <h2 className="text-xl font-bold">{meal.title}</h2>

                            {/* Display Reviews */}
                            <div className="mt-4">
                                {meal.reviews.review_count > 0 ? (
                                    <ul className="list-disc pl-5">
                                        {meal.reviews.reviews.map((review, index) => (
                                            <li key={index} className="mt-2">
                                                {review.review ? review.review : "No review available"}
                                                <span className='font-bold'>({review.name})</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No reviews yet.</p>
                                )}
                            </div>
                        </div>)
                    }
                </div>
            </div>

        </>
    );
};

export default CustomerTestimonials;