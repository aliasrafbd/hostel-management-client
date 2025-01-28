import React, { useEffect, useState } from 'react';
import Banner from '../../components/Banner';
import MealsByCategory from '../../components/MealsByCategory';
import useMeals from '../../hooks/useMeals';
import PopularMeals from '../../components/PopularMeals';
import Packages from '../../components/Packages';
import { useQuery } from '@tanstack/react-query';
import debounce from "lodash.debounce"; // Install lodash.debounce for debouncing
import useAxiosSecure from '../../hooks/useAxiosSecure';


const Home = () => {

    const [search, setSearch] = useState(""); // State for search input
    const [debouncedSearch, setDebouncedSearch] = useState(""); // Debounced search state
    const [category, setCategory] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [page, setPage] = useState(1);

    const axiosSecure = useAxiosSecure();

    useEffect(() => {
        const handler = debounce(() => {
            setDebouncedSearch(search);
        }, 300);

        handler();
        return () => handler.cancel();
    }, [search]);

    useEffect(() => {
        console.log("Debounced Search:", debouncedSearch);
    }, [debouncedSearch]);


    const { data: meals = [], isLoading, error } = useQuery({
        queryKey: ["meals", debouncedSearch],
        queryFn: async () => {
            console.log("API hit with search:", debouncedSearch); // Debugging the value
            const response = await axiosSecure.get(`/meals/hostel`, {
                params: {
                    search: debouncedSearch, // Pass search as a query parameter
                },
            });
            return response.data;
        },
        enabled: !!debouncedSearch || search === "", // Run query when there's a search term or it's cleared
    });



    // console.log(data?.data);

    // if (isLoading) {
    //     return <span class="loader"></span>
    // }

    // const breakfast = data?.data?.filter((meal) => meal.category === "Breakfast");
    // const lunch = data?.data?.filter((meal) => meal.category === "Lunch");
    // const dinner = data?.data?.filter((meal) => meal.category === "Dinner");

    return (
        <div className=''>
            <Banner search={search} setSearch={setSearch}></Banner>
            <MealsByCategory meals={meals}></MealsByCategory>
            <PopularMeals meals={meals} isLoading={isLoading} error={error}></PopularMeals>
            <Packages></Packages>
        </div>
    );
};

export default Home;