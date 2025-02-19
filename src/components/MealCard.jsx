import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ReactStars from 'react-rating-stars-component';
import { FcLike } from "react-icons/fc";
import AOS from 'aos';
import 'aos/dist/aos.css';


const MealCard = ({ meal }) => {

    const { pathname } = useLocation();
    console.log(pathname);

    const { _id, price, rating, reaction, description, reviews, title, image, category, ingredients } = meal;

    const shortDescription = description.split(' ').slice(0, 20).join(' ');

    useEffect(() => {
        // Initialize AOS
        AOS.init();
    }, []);

    return (
        <div className="card bg-base-100 w-[96%] lg:w-full mx-auto shadow-xl group relative overflow-hidden border border-gray-400"
            data-aos="zoom-in"
        >
            <figure className="relative">
                <img
                    className="h-[300px] w-full transition-transform duration-300 group-hover:scale-110"
                    src={image}
                    alt="Meal"
                />
                {
                    pathname !== "/upcomingmeals" && (<Link
                        to={`/meal/${_id}`}
                        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white text-black border border-white py-2 px-4 rounded-full hover:bg-black hover:text-white"
                    >
                        Meal Details
                    </Link>)
                }

            </figure>
            <div className="flex flex-col px-2 min-h-[250px]">
                <div>
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
                </div>

                {/* Make this div take up all available space */}
                <div className="flex-grow mt-4">
                    <h2>{shortDescription}...</h2>
                </div>

                <h2 className="text-center p-8 text-md font-extrabold">{title}</h2>
                <p className="pb-6">{price}/-</p>
            </div>

        </div>


    );
};

export default MealCard;