import React, { useEffect, useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import SectionHeading from './SectionHeading';
import useMeals from '../hooks/useMeals';
import MealCard from './MealCard';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../hooks/useAxiosSecure';


const MealsByCategory = ({ meals }) => {

    const axiosSecure = useAxiosSecure();

    const [tabIndex, setTabIndex] = useState(0);

    const [search, setSearch] = useState(""); // State for search input
    const [category, setCategory] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    // const { data: meals, isLoading, error } = useQuery({
    //     queryKey: ['meals'], // Unique key for the query
    //     queryFn: async () => {
    //         const response = await axiosSecure('/meals/hostel');
    //         return response.data; // Return the data from the response
    //     },
    // })

    console.log(meals);

    // if(isLoading) {
    //     return <span class="loader"></span>
    // }

    // console.log(data?.data);

    const breakfast = meals?.filter((meal) => meal.category === "Breakfast");
    const lunch = meals?.filter((meal) => meal.category === "Lunch");
    const dinner = meals?.filter((meal) => meal.category === "Dinner");

    return (
        <div className='mx-auto max-w-7xl' >
            <SectionHeading title="Meals by Category" subtitle=""></SectionHeading>
            <Tabs defaultIndex={tabIndex} onSelect={(index) => setTabIndex(index)}>
                <TabList className="mb-8 lg:mb-4">
                    <Tab>Breakfast</Tab>
                    <Tab>Lunch</Tab>
                    <Tab>Dinner</Tab>
                    <Tab>All Meals</Tab>
                </TabList>
                <TabPanel>
                    <div className='grid grid-cols-1 mb-6 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {
                            breakfast.map(meal => <MealCard key={meal._id} meal={meal}></MealCard>)
                        }
                    </div>
                </TabPanel>
                <TabPanel>
                    <div className='grid grid-cols-1 mb-6 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {
                            lunch.map(meal => <MealCard key={meal._id} meal={meal}></MealCard>)
                        }
                    </div>
                </TabPanel>
                <TabPanel>
                    <div className='grid grid-cols-1 mb-6 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {
                            dinner.map(meal => <MealCard key={meal._id} meal={meal}></MealCard>)
                        }
                    </div>
                </TabPanel>
                <TabPanel>
                    <div className='grid grid-cols-1 mb-6 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {
                            meals?.map(meal => <MealCard key={meal._id} meal={meal}></MealCard>)
                        }
                    </div>
                </TabPanel>
            </Tabs>
        </div >
    );
};

export default MealsByCategory;