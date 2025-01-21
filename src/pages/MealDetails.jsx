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

    const { user } = useContext(AuthContext);

    const axiosSecure = useAxiosSecure();
    const { id } = useParams();

    const { data, isLoading, error, refetch } = useMeal(id)

    if(isLoading) {
        return <Loading></Loading>
    }

    console.log(data);

    // const loadedMeals = useLoaderData();

    const [review, setReview] = useState('');
    const [message, setMessage] = useState('');
    // const [reviewCount, setReviewCount] = useState(0);
    // const [reviews, setReviews] = useState([]);

    // const [loadedMeal] = [...loadedMeals].filter(meal => meal._id == id);

    
    const {_id, price, rating, title, reaction: { count, userEmails } } = data;

    // including meal image, distributor name, description, ingredients, post time, rating, like button, meal request button, and reviews.

    const [isRatingClicked, setIsRatingClicked] = useState(false);

    const [rate, setRate] = useState(rating);

    const handleUpdateRating = async (newRatingValue) => {
        // Calculate the new average rating
        let newAverageRating;
        if (rate == 0) {
            newAverageRating = (rate + newRatingValue) / 1;
        }
        else {
            newAverageRating = (rate + newRatingValue) / 2;
        }

        console.log(isRatingClicked);

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
            const response = await axios.patch(`http://localhost:5000/meals/${_id}/rating`, {
                newRating: newAverageRating,

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
            <div className='w-full'>
                <img src={data.image} alt="" />
                <h1 className="text-3xl font-bold mb-4">{title}</h1>
                <p className="text-lg mb-2">Price: ${price}</p>
                {/* <p className="text-lg mb-2">Rating: {rating}</p> */}
                {
                    user && <LikeButton
                        mealId={_id}
                        userEmails={userEmails}
                        initialReaction={count}
                    />
                }
                {
                    user && <RequestButton
                        meal={data}
                    // userEmail={user?.email}
                    // initialReaction={reaction}
                    >
                    </RequestButton>
                }


                {/* Example Button to Add a Rating */}

                <div className='flex gap-2 items-center'>
                    <p>Meal Rating: {rate?.toFixed(1)}

                    </p>
                    (<ReactStars

                        key={rate} // Use the updated rating state as the key
                        count={5}
                        value={rate} // Use the updated rating state
                        size={30}
                        edit={false} // Make it read-only
                        activeColor="#ddd700"
                    />) 
                </div>
                {/* <div>
                <button className='btn btn-ghost' onClick={() => handleUpdateRating(4)}>Add Rating: 5</button>
            </div> */}

            </div>

            {/* Review Section  */}



            <div>
                {/* Display review count */}
                {/* <div>
                    <h2>Review Count: {data.reviews.review_count}</h2>
                </div> */}

                {/* Review form */}
                <div>
                    <textarea
                        className='textarea textarea-primary w-full'
                        value={review}
                        onChange={(e) => setReview(e.target.value)}  // Update review state
                        placeholder="Write your review here"
                    />
                </div>
                    {/* Display message */}
                    {message && <p className='text-red-600'>{message}</p>}
                
                    <button className='btn btn-secondary block text-center mx-auto my-2' onClick={handleReviewSubmit}>Submit</button>

                <div className={isRatingClicked ? 'hidden' : 'flex gap-2 items-center'}>
                    <p>Please Rate this {title}</p>
                    <ReactStars
                        count={5}
                        value={0} // User's initial input value
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
                                <span className='font-bold'>{user?.displayName}</span>
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