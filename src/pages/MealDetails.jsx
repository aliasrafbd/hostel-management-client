import React, { useContext, useEffect, useState } from 'react';
import { useLoaderData, useParams } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';
import LikeButton from '../components/LikeButton';
import RequestButton from '../components/RequestButton';
import Loading from '../components/Loading';

const MealDetails = () => {


    const { user } = useContext(AuthContext);

    const { id } = useParams();
    const loadedMeals = useLoaderData();

    const [loadedMeal] = [...loadedMeals].filter(meal => meal._id == id);

    const { _id, price, rating, title, reaction } = loadedMeal;


    // Fetch the meal details, including the average rating
    useEffect(() => {
        const fetchMeal = async () => {
            try {
                const response = await axios.get(`/meal/${_id}`);
                setMeal(response.data); // Store the meal details
            } catch (error) {
                console.error("Error fetching meal details:", error);
            }
        };
        fetchMeal();
    }, [_id]);

    // Handle the rating change
    const handleRatingChange = async (newRating) => {
        try {
            // Send the updated rating to the backend
            await axios.put(`/meal/${_id}/rate`, { rating: newRating });

            // Re-fetch the updated meal data to get the new average rating
            const response = await axios.get(`/meal/${_id}`);
            setMeal(response.data);

            setUserRating(newRating); // Update the rating in the state
        } catch (error) {
            console.error("Error submitting rating:", error);
        }
    };

    if (!meal) return <Loading></Loading>

    // including meal image, distributor name, description, ingredients, post time, rating, like button, meal request button, and reviews.

    if (!loadedMeal) return <p>Loading meal details...</p>;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <h1 className="text-3xl font-bold mb-4">{title}</h1>
            <p className="text-lg mb-2">Price: ${price}</p>
            <p className="text-lg mb-2">Rating: {rating}</p>
            <LikeButton
                mealId={_id}
                userEmail={user?.email}
                initialReaction={reaction}
            />
            {
                <RequestButton
                    meal={loadedMeal}
                />
            }




        </div>
    );
};

export default MealDetails;