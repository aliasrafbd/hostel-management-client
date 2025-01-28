import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import ReactStars from 'react-rating-stars-component';
import { FcLike } from "react-icons/fc";


const MealCard = ({ meal }) => {

    // rating, id, title, category, ingredients, description, postTime, distributorEmail, distributorName, price, image, reactionCount, reactionUserEmails, 

    const { pathname } = useLocation();
    console.log(pathname);

    const { _id, price, rating, reaction, reviews, title, image, category, ingredients } = meal;

    // reaction.count, reviews.review_count,

    return (
        <div className="card bg-base-100 w-[96%] lg:w-full mx-auto shadow-xl group relative overflow-hidden border border-gray-400">
            <figure className="relative">
                <img
                    className="h-80 w-full transition-transform duration-300 group-hover:scale-110" // Scale on hover
                    src={image}
                    alt="Meal"
                />
                {/* Button to show on hover */}
                {
                    pathname !== "/upcomingmeals" && (<Link
                        to={`/meal/${_id}`}
                        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white text-black border border-white py-2 px-4 rounded-full hover:bg-black hover:text-white"
                    >
                        Meal Details
                    </Link>)
                }

            </figure>
            <div className="px-2">
                <div className="grid grid-cols-2 justify-around">
                    <div className="flex gap-1 items-center">
                        <span><FcLike /></span>
                        <p>{reaction?.count}</p>
                    </div>
                    <div className="flex justify-end gap-2 items-center">
                        <p>{rating?.toFixed(1)}</p>
                        <div>
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
                <h2 className="text-center text-md font-extrabold">{title}</h2>
                <p className='pb-6'>{price}/-</p>
            </div>
        </div>


    );
};

export default MealCard;