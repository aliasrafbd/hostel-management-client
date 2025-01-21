import React, { useState } from 'react';
// import MealCard from '../../../components/MealCard';
import useMeals from '../../../hooks/useMeals';
import useAdmin from '../../../hooks/useAdmin';
import { useLocation } from 'react-router-dom';
import MealsTable from '../../../components/MealsTable';

const AllMeals = () => {

    const [search, setSearch] = useState(""); // State for search input
    const [category, setCategory] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    const { data: meals, isLoading, error } = useMeals({ search, category, minPrice, maxPrice });

    const [isAdmin, isAdminLoading] = useAdmin();

    console.log(isAdmin, isAdminLoading);

    const { pathname } = useLocation();
    console.log(pathname);
    // /dashboard/allmeals
    // if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading meals</div>;

    return (
        <>
            {
                pathname !== "/dashboard/allmeals" ? (<div className='mx-auto max-w-7xl my-4'>
                    {/* Search Input */}
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Search meals..."
                            className="input mr-2 input-bordered w-full max-w-md mb-2"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <select
                            className="select select-bordered w-full max-w-md mb-2"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="">All Categories</option>
                            <option value="Breakfast">Breakfast</option>
                            <option value="Lunch">Lunch</option>
                            <option value="Dinner">Dinner</option>
                        </select>
                        <div>
                            <p className='my-4'>Sort by Price:</p>
                            <div className="flex gap-4">
                                <input
                                    type="number"
                                    placeholder="Min Price"
                                    className="input input-bordered"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                />
                                <input
                                    type="number"
                                    placeholder="Max Price"
                                    className="input input-bordered"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    {/* md:grid-cols-2 lg:grid-cols-3  */}
                    <div className="grid grid-cols-1 gap-4">
                        {meals.length > 0 ? (
                            meals.map((meal) => (
                                <div key={meal._id} className="card bg-base-100 shadow-md">
                                    <figure>
                                        <img
                                            src={meal.image}
                                            alt={meal.title}
                                            className="w-full h-48 object-cover"
                                        />
                                    </figure>
                                    <div className="card-body">
                                        <h2 className="card-title">{meal.title}</h2>
                                        <p>{meal.description}</p>
                                        <p className="text-lg font-bold">${meal.price}</p>
                                        <p>Category: {meal.category}</p>
                                    </div>
                                    TODO: Implement infinite scrolling to load more meal cards as the user scrolls.
                                    You can use these packages:
                                    React-infinite-scroller
                                    react-infinite-scroll-component
                                </div>
                            ))
                        ) : (
                            <p>No meals found</p>
                        )}
                    </div>
                </div>) :
                    (
                        <>
                            <div>
                                <MealsTable></MealsTable>
                            </div>
                        </>
                    )
            }
        </>
    );
};

export default AllMeals;