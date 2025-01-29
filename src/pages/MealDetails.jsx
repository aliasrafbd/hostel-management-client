import React, { useContext, useEffect, useState } from 'react';
import { useLoaderData, useParams } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';
import LikeButton from '../components/LikeButton';
import RequestButton from '../components/RequestButton';
import axios from 'axios';
import ReactStars from 'react-rating-stars-component';
import Swal from 'sweetalert2';
import useAxiosSecure from '../hooks/useAxiosSecure';
import useMeal from '../hooks/useMeal';
import Loading from '../components/Loading';

const MealDetails = () => {


    const [review, setReview] = useState('');
    const [message, setMessage] = useState('');
    const [isRatingClicked, setIsRatingClicked] = useState(false);

    const { user } = useContext(AuthContext);

    const axiosSecure = useAxiosSecure();
    const { id } = useParams();

    const { data, isLoading, error, refetch } = useMeal(id)

    if (isLoading || data.length < 0) {
        return <Loading></Loading>
    }

    console.log(data);

    const { _id, price, rating, title, description, ingredients, reviews, reaction: { count, userEmails } } = data;

    const handleUpdateRating = async (newUserRating) => {

        refetch();
        const response = await axios.patch(`https://hostel-management-server-orcin.vercel.app/meals/${_id}/rating`, { newUserRating });
        
    };

    const handleReviewSubmit = async () => {
        if (review.trim()) {
            try {
                const response = await axiosSecure.put(`/api/update-review/${data._id}`, {
                    review: review,
                    userEmail: user?.email,
                    name: user?.displayName,
                });
                if (response.data.modifiedCount > 0) {
                    Swal.fire({
                        position: "top",
                        icon: "success",
                        title: `Review added successfully`,
                        showConfirmButton: false,
                        timer: 1500
                    })
                    refetch();
                }
            } catch (error) {
                console.error('Error posting review:', error);
                setMessage('Error posting review');
            }
        } else {
            setMessage('Please write a review before submitting.');
        }
    };

    if (!data) return <p>Loading meal details...</p>;

    return (
        <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg">
            {/* Meal Details Section  */}
            <div className='grid grid-cols-1 md:grid-cols-2 mb-20 gap-12'>
                <div>
                    <img className='w-full h-[300px] md:h-[370px] lg:h-[410px] rounded-lg' src={data.image} alt="" />
                    <div className='grid grid-cols-2'>
                        <div>
                            {
                                user && <LikeButton
                                    mealId={_id}
                                    userEmails={userEmails}
                                    initialReaction={count}
                                />
                            }
                        </div>
                        <div className='flex gap-2 items-center justify-end'>
                            <p>{rating?.toFixed(1)}
                            </p>
                            <ReactStars

                                key={rating} 
                                count={5}
                                value={rating} 
                                size={20}
                                edit={false} 
                                activeColor="#ddd700"
                            />
                        </div>
                    </div>
                </div>

                <div className=''>
                    <h1 className="text-3xl font-bold mb-4">{title}</h1>

                    <p className=''><span className='font-bold'>Ingredients:</span> <br /> {ingredients}</p>
                    <br />
                    <p><span className='font-bold'>Description:</span> <br /> {description}</p>
                    <br />
                    <p><span className='font-bold'>Total Review:</span> {reviews.review_count}</p>
                    <p><span className='font-bold'>Price:</span> {price}</p>
                    {
                        user && <RequestButton
                            meal={data}
                        >
                        </RequestButton>
                    }
                </div>
            </div>


            {/* Review Section  */}
            <div>
                <div className='grid gap-6 grid-cols-1 md:grid-cols-2 mb-20 items-center justify-between'>
                    <div className={isRatingClicked ? 'hidden' : 'flex gap-2 items-center'}>
                        <p>Put Rating for <span className='font-bold text-orange-600'>{title}</span>:</p>
                        <ReactStars
                            count={5}
                            value={rating} 
                            onChange={handleUpdateRating}
                            size={30}
                            activeColor="#ffd799"
                        />
                    </div>
                    <div className='flex gap-4 items-center'>
                        <div className='w-full'>
                            <div>
                                <textarea
                                    className='textarea textarea-primary w-full'
                                    value={review}
                                    rows={3}
                                    onChange={(e) => setReview(e.target.value)}
                                    placeholder="Write your review here"
                                />
                            </div>
                            <div>
                                {/* Display message */}
                                {message && <p className='text-red-600'>{message}</p>}
                            </div>
                        </div>
                        <div>
                            <button className='btn btn-secondary block text-center mx-auto my-2' onClick={handleReviewSubmit}>Post Review</button>
                        </div>
                    </div>
                </div>

                {/* Display reviews */}
                <div>
                    {data.reviews.reviews.length > 0 ? (
                        data.reviews.reviews.map((rev, index) => (
                            <div key={index}>
                                <br />
                                <span className='font-bold'>{rev?.name}</span>
                                <p>{rev.review}</p>
                                <small>{new Date(rev.createdAt).toLocaleString()}</small>
                            </div>
                        ))
                    ) : (
                        <p>No reviews yet</p>
                    )}
                </div>
            </div>
        </div >
    );
};

export default MealDetails;