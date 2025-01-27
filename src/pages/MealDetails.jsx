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
    const [rate, setRate] = useState(0);

    // const [reviewCount, setReviewCount] = useState(0);
    // const [reviews, setReviews] = useState([]);

    const { user } = useContext(AuthContext);

    const axiosSecure = useAxiosSecure();
    const { id } = useParams();

    const { data, isLoading, error, refetch } = useMeal(id)

    if (isLoading || data.length < 0) {
        return <Loading></Loading>
    }

    console.log(data);

    // const loadedMeals = useLoaderData();


    // const [loadedMeal] = [...loadedMeals].filter(meal => meal._id == id);


    const { _id, price, rating, title, description, ingredients, reviews, reaction: { count, userEmails } } = data;


    const handleUpdateRating = async (newRatingValue) => {
        // Calculate the new average rating

        console.log("new Rating value", newRatingValue);

        let newAverageRating;
        if (rate == 0) {
            newAverageRating = (parseFloat(rate) + newRatingValue) / 1;
        }
        else {
            newAverageRating = (parseFloat(rate) + newRatingValue) / 2;
        }

        // console.log(newAverageRating);
        if (userEmails.includes(user?.email)) {
            Swal.fire({
                position: "top",
                icon: "info",
                title: `You already rated this meal`,
                showConfirmButton: false,
                timer: 1500
            })
            return;
        }

        try {
            // Send a request to update the rating
            const response = await axios.patch(`https://hostel-management-server-orcin.vercel.app/meals/${_id}/rating`, {
                newRating: parseFloat(newAverageRating),

            });
            console.log("inside patch", newAverageRating);
            console.log(response.data);

            if (response.status === 200) {
                if (!isRatingClicked) {
                    setRate(newAverageRating);
                    setIsRatingClicked(true); // Disable further rating after the first click
                }
            }
        } catch (error) {
            console.error('Error updating the rating:', error);
        }
    };

    // Handle review submission
    const handleReviewSubmit = async () => {
        if (review.trim()) {
            try {
                // Send PUT request to update reviews for the loaded meal using axios
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


    console.log(count);

    if (!data) return <p>Loading meal details...</p>;

    return (
        <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg">
            {/* Meal Details Section  */}
            <div className='grid grid-cols-2 mb-20 gap-12'>
                <div>
                    <img className='w-full rounded-lg' src={data.image} alt="" />
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
                            <p>{rate?.toFixed(1)}
                            </p>
                            <ReactStars

                                key={rate} // Use the updated rating state as the key
                                count={5}
                                value={rate} // Use the updated rating state
                                size={20}
                                edit={false} // Make it read-only
                                activeColor="#ddd700"
                            />
                        </div>
                    </div>
                </div>

                <div className='w-1/2'>
                    <h1 className="text-3xl font-bold mb-4">{title}</h1>
                    
                    <p>Ingredients: {ingredients}</p>
                    <p>Description: {description}</p>
                    <p>Total Review: {reviews.review_count}</p>
                    <p>Price: {price}</p>
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
                <div>
                    <textarea
                        className='textarea textarea-primary w-full'
                        value={review}
                        onChange={(e) => setReview(e.target.value)}  
                        placeholder="Write your review here"
                    />
                </div>
                {/* Display message */}
                {message && <p className='text-red-600'>{message}</p>}

                <button className='btn btn-secondary block text-center mx-auto my-2' onClick={handleReviewSubmit}>Post Review</button>

                <div className={isRatingClicked ? 'hidden' : 'flex gap-2 items-center'}>
                    <p>Rate Us: {title}</p>
                    <ReactStars
                        count={5}
                        value={rate} // User's initial input value
                        onChange={handleUpdateRating}
                        size={30}
                        activeColor="#ffd799"
                    />
                </div>


                {/* Display reviews */}
                <div>
                    <h3 className='text-center font-bold my-12 text-3xl'>{title.charAt(0).toUpperCase() + title.slice(1).toLowerCase()} Reviews:</h3>
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