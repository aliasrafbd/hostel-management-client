import React, { useState, useEffect } from 'react';
import useMeals from '../../../hooks/useMeals';
import useAdmin from '../../../hooks/useAdmin';
import { useLocation } from 'react-router-dom';
import MealsTable from '../../../components/MealsTable';
import InfiniteScroll from 'react-infinite-scroll-component';
import axios from 'axios';
import UpdateMealWithModal from '../../../components/UpdateMealWithModal';
import MealCard from '../../../components/MealCard';
import AOS from 'aos';
import 'aos/dist/aos.css'; // Import the AOS styles


const AllMeals = () => {
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [category, setCategory] = useState("");
    const [sortBy, setSortBy] = useState("ascending");

    const [sortByAscending, setSortByAscending] = useState();
    const [sortByDescending, setSortByDescending] = useState();
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

    const meals = data?.data || [];
    const [sortedMeals, setSortedMeals] = useState([...meals]);

    const { pathname } = useLocation();


    // Sorting logic
    useEffect(() => {
        if (meals.length > 0) { // Ensure meals array is not empty
            const sorted = [...meals].sort((a, b) => {
                return sortBy === "ascending" ? a.price - b.price : b.price - a.price;
            });
            setSortedMeals(sorted);
        }
    }, [meals, sortBy]); // Depend on meals and sortBy


    const handleSearch = async () => {
        try {
            const response = await axios.get(`https://hostel-management-server-orcin.vercel.app/meals/search?q=${searchTerm}`);
            setSearchResults(response.data);
        } catch (error) {
            console.error("Error fetching search results:", error);
        }
    };


    const pagination = data?.pagination || {};

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 1000);

        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        // Initialize AOS
        AOS.init();
    }, []);


    const loadMoreMeals = () => {
        if (pagination.page < pagination.totalPages) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    const handleUpdateClick = (meal) => {
        setSelectedMeal(meal);
        setModalOpen(true);
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
                        <div className="mb-4">
                            <label className="mr-2 font-semibold">Sort by Price:</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="border p-2 rounded"
                            >
                                <option value="ascending">Low to High</option>
                                <option value="descending">High to Low</option>
                            </select>
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
                            dataLength={sortedMeals.length}
                            next={loadMoreMeals}
                            hasMore={pagination.page < pagination.totalPages}
                            loader={<p className='text-center py-4'>Loading more meals...</p>}
                        >
                            <div className="grid grid-cols-1 mb-6 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {(searchResults.length || sortedMeals.length ? sortedMeals : meals).map((meal) => (
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
