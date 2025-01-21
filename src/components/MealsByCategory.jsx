import React, { useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import SectionHeading from './SectionHeading';
import useMeals from '../hooks/useMeals';
import MealCard from './MealCard';


const MealsByCategory = () => {

    const [tabIndex, setTabIndex] = useState(0);

    const [search, setSearch] = useState(""); // State for search input
    const [category, setCategory] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    const { data, isLoading } = useMeals({ search, category, minPrice, maxPrice })

    if (isLoading) {
        return <span class="loader"></span>
    }

    const breakfast = data?.data?.filter((meal) => meal.category === "Breakfast");
    const lunch = data?.data?.filter((meal) => meal.category === "Lunch");
    const dinner = data?.data?.filter((meal) => meal.category === "Dinner");

    console.log(breakfast);
    console.log(lunch);
    console.log(dinner);


    return (
        <div className='mx-auto max-w-7xl'>
            <SectionHeading title="Meals by Category" subtitle=""></SectionHeading>
            <Tabs defaultIndex={tabIndex} onSelect={(index) => setTabIndex(index)}>
                <TabList>
                    <Tab>Breakfast</Tab>
                    <Tab>Lunch</Tab>
                    <Tab>Dinner</Tab>
                    <Tab>All Meals</Tab>
                </TabList>
                <TabPanel>
                    <div className='grid grid-cols-3 gap-6'>
                        {
                            breakfast.map(meal => <MealCard key={meal._id} meal={meal}></MealCard>)
                        }
                    </div>
                </TabPanel>
                <TabPanel>
                    <div className='grid grid-cols-3 gap-6'>
                        {
                            lunch.map(meal => <MealCard key={meal._id} meal={meal}></MealCard>)
                        }
                    </div>
                </TabPanel>
                <TabPanel>
                    <div className='grid grid-cols-3 gap-6'>
                        {
                            dinner.map(meal => <MealCard key={meal._id} meal={meal}></MealCard>)
                        }
                    </div>
                </TabPanel>
                <TabPanel>
                    <div className='grid grid-cols-3 gap-6'>
                        {
                            data?.data?.map(meal => <MealCard key={meal._id} meal={meal}></MealCard>)
                        }
                    </div>
                </TabPanel>
            </Tabs>
        </div>
    );
};

export default MealsByCategory;