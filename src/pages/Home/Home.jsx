import React from 'react';
import Banner from '../../components/Banner';
import MealsByCategory from '../../components/MealsByCategory';
import useMeals from '../../hooks/useMeals';
import PopularMeals from '../../components/PopularMeals';
import Packages from '../../components/Packages';

const Home = () => {


    const {data, isLoading} = useMeals()

    if(isLoading) {
        return <span class="loader"></span>
    }
    
    const breakfast = data?.filter((meal) => meal.category === "Breakfast");
    const lunch = data?.filter((meal) => meal.category === "Lunch");
    const dinner = data?.filter((meal) => meal.category === "Dinner");

    console.log(breakfast);
    console.log(lunch);
    console.log(dinner);

    return (
        <div className=''>
            <Banner></Banner>
            <MealsByCategory></MealsByCategory>
            <PopularMeals></PopularMeals>
            <Packages></Packages>
        </div>
    );
};

export default Home;