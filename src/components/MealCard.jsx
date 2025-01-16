import React from 'react';
import { Link } from 'react-router-dom';

const MealCard = ({meal}) => {

    const {_id, price, rating, image, title} = meal;

    return (
        <div className="card bg-base-100 w-96 shadow-xl">
            <figure>
                <img
                    className='h-80 w-full'
                    src={image}
                    alt="Shoes" />
            </figure>
            <div className="card-body">
                <h2 className="card-title">{title}</h2>
                <div className="card-actions justify-end">
                    <p>{price}</p>
                    <p>{rating}</p>
                </div>
                <Link to={`/meal/${_id}`}><button className='btn btn-error'>Meal Details</button></Link>
            </div>
        </div>
    );
};

export default MealCard;