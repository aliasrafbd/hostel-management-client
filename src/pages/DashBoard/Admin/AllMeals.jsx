import React, { useState, useEffect } from 'react';
import useMeals from '../../../hooks/useMeals';
import useAdmin from '../../../hooks/useAdmin';
import { useLocation } from 'react-router-dom';
import MealsTable from '../../../components/MealsTable';
import InfiniteScroll from 'react-infinite-scroll-component';
import axios from 'axios';
import UpdateMealWithModal from '../../../components/UpdateMealWithModal';
import MealCard from '../../../components/MealCard';

const AllMeals = () => {
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [category, setCategory] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedInput, setSelectedInput] = useState('input1');

    const { data, isLoading, error } = useMeals({
        search: debouncedSearch,
        category,
        minPrice,
        maxPrice,
        page,
        limit: 10,
    });

    const { pathname } = useLocation(); // To detect the current route

    const handleSearch = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/meals/search?q=${searchTerm}`);
            setSearchResults(response.data);
        } catch (error) {
            console.error("Error fetching search results:", error);
        }
    };

    const meals = data?.data || [];
    const pagination = data?.pagination || {};

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 1000);

        return () => clearTimeout(timer);
    }, [search]);

    const loadMoreMeals = () => {
        if (pagination.page < pagination.totalPages) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    const handleUpdateClick = (meal) => {
        setSelectedMeal(meal); // Set the selected meal
        setModalOpen(true); // Open the modal
    };

    if (error) {
        return <div>Error loading meals: {error.message}</div>;
    }

    return (
        <>
            {pathname === '/dashboard/allmeals' ? (
                <MealsTable />
            ) : (
                <div className="mx-auto max-w-7xl my-4">
                    <div className="mb-4">
                        <select
                            className="select select-bordered w-[90%] lg:w-full ml-2 lg:ml-0 max-w-md mb-2"
                            value={category}
                            onChange={(e) => {
                                setPage(1);
                                setCategory(e.target.value);
                            }}
                        >
                            <option value="">All Categories</option>
                            <option value="Breakfast">Breakfast</option>
                            <option value="Lunch">Lunch</option>
                            <option value="Dinner">Dinner</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:px-0 px-2 gap-4">
                        <div>
                            <p className="my-4">Sort by Price:</p>
                            <div className="flex gap-4">
                                <input
                                    type="number"
                                    placeholder="Min Price"
                                    className="input input-bordered w-[100px] lg:w-[200px]"
                                    value={minPrice}
                                    onChange={(e) => {
                                        setPage(1);
                                        setMinPrice(e.target.value);
                                    }}
                                />
                                <input
                                    type="number"
                                    placeholder="Max Price"
                                    className="input input-bordered w-[100px] lg:w-[200px]"
                                    value={maxPrice}
                                    onChange={(e) => {
                                        setPage(1);
                                        setMaxPrice(e.target.value);
                                    }}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center mb-4">
                                <p className="mr-4">Search by:</p>
                                <select
                                    className="select select-bordered w-[60%] lg:w-full max-w-xs"
                                    value={selectedInput}
                                    onChange={(e) => setSelectedInput(e.target.value)}
                                >
                                    <option value="input1">Regular Search</option>
                                    <option value="input2">Indexing Search</option>
                                </select>
                            </div>

                            {selectedInput === 'input1' ? (
                                <input
                                    type="text"
                                    placeholder="Search meals..."
                                    className="input input-bordered md:w-[96%] ml-0 w-full lg:w-full md:ml-3 lg:ml-0 mb-4"
                                    value={search}
                                    onChange={(e) => {
                                        setPage(1);
                                        setSearch(e.target.value);
                                    }}
                                />
                            ) : (
                                <div className="flex mb-4 items-center w-[100%]">
                                    <input
                                        type="text"
                                        placeholder="Search meals..."
                                        className="input input-bordered w-full"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <button
                                        className="btn btn-primary ml-2"
                                        onClick={handleSearch}
                                    >
                                        Search
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {meals.length > 0 ? (
                        <InfiniteScroll
                            dataLength={meals.length}
                            next={loadMoreMeals}
                            hasMore={pagination.page < pagination.totalPages}
                            loader={<p className='text-center py-4'>Loading more meals...</p>}
                        >
                            <div className="grid grid-cols-1 mb-6 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {(searchResults.length ? searchResults : meals).map((meal) => (
                                    <MealCard key={meal._id} meal={meal}></MealCard>
                                ))}
                            </div>
                        </InfiniteScroll>
                    ) : (
                        <p className="text-center text-red-500 font-extrabold text-3xl my-28">
                            No Meals Found named: <span className="text-green-700">{search}</span>
                        </p>
                    )}
                </div>
            )}
        </>
    );
};

export default AllMeals;
