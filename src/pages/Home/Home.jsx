import React, { useState } from 'react';
import Banner from '../../components/Banner';
import MealsByCategory from '../../components/MealsByCategory';
import useMeals from '../../hooks/useMeals';
import PopularMeals from '../../components/PopularMeals';
import Packages from '../../components/Packages';

const Home = () => {


    const [search, setSearch] = useState(""); // State for search input
    const [category, setCategory] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    const { data, isLoading } = useMeals({ search, category, minPrice, maxPrice })

    if (isLoading) {
        return <span class="loader"></span>
    }

    const breakfast = data?.filter((meal) => meal.category === "Breakfast");
    const lunch = data?.filter((meal) => meal.category === "Lunch");
    const dinner = data?.filter((meal) => meal.category === "Dinner");

    console.log(breakfast);
    console.log(lunch);
    console.log(dinner);

    return (
        <div className='mx-auto max-w-7xl my-4'>
            <Banner></Banner>
            <MealsByCategory></MealsByCategory>
            <PopularMeals></PopularMeals>
            <Packages></Packages>
        </div>
    );
};

export default Home;