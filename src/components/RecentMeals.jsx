import React, { useState } from 'react';
import useMeals from '../hooks/useMeals';
import MealCard from './MealCard';
import SectionHeading from './SectionHeading';

const RecentMeals = ({meals, isLoading, error}) => {


    if (isLoading) {
        return <span class="loader"></span>
    }

    console.log(meals);

    const sortedMeals = [...meals].sort((a, b) => b.postTime - a.postTime);

    return (
        <>
            <div className='mx-auto max-w-7xl my-4'>
                <SectionHeading title="Recent Meals" subtitle=""></SectionHeading>
                <div className='grid grid-cols-1 mb-6 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {
                        sortedMeals.map(meal => <MealCard key={meal._id} meal={meal}></MealCard>)
                    }
                </div>
            </div>
        </>
    );
};



export default RecentMeals;