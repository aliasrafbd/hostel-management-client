import React, { useState } from 'react';
import useMeals from '../hooks/useMeals';
import MealCard from './MealCard';
import SectionHeading from './SectionHeading';

const PopularMeals = ({meals, isLoading, error}) => {


    // const [search, setSearch] = useState(""); // State for search input
    // const [category, setCategory] = useState("");
    // const [minPrice, setMinPrice] = useState("");
    // const [maxPrice, setMaxPrice] = useState("");

    // const { data, isLoading } = useMeals({ search, category, minPrice, maxPrice })

    if (isLoading) {
        return <span class="loader"></span>
    }

    const sortedMeals = [...meals].sort((a, b) => b.rating - a.rating);

    return (
        <>
            <div className='mx-auto max-w-7xl my-4'>
                <SectionHeading title="Popular Meals" subtitle=""></SectionHeading>
                <div className='grid grid-cols-3 gap-6'>
                    {
                        sortedMeals.map(meal => <MealCard key={meal._id} meal={meal}></MealCard>)
                    }
                </div>
            </div>
        </>
    );
};



export default PopularMeals;