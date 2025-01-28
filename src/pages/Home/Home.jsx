import React, { useEffect, useState } from 'react';
import Banner from '../../components/Banner';
import MealsByCategory from '../../components/MealsByCategory';
import useMeals from '../../hooks/useMeals';
import PopularMeals from '../../components/PopularMeals';
import Packages from '../../components/Packages';
import { useQuery } from '@tanstack/react-query';
import debounce from "lodash.debounce"; 
import useAxiosSecure from '../../hooks/useAxiosSecure';


const Home = () => {

    const [search, setSearch] = useState(""); 
    const [debouncedSearch, setDebouncedSearch] = useState(""); 
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
            console.log("API hit with search:", debouncedSearch); 
            const response = await axiosSecure.get(`/meals/hostel`, {
                params: {
                    search: debouncedSearch, 
                },
            });
            return response.data;
        },
        enabled: !!debouncedSearch || search === "", 
    });


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