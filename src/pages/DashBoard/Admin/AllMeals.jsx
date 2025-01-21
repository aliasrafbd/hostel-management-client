import React, { useState, useEffect } from 'react';
import useMeals from '../../../hooks/useMeals';
import useAdmin from '../../../hooks/useAdmin';
import { useLocation } from 'react-router-dom';
import MealsTable from '../../../components/MealsTable';
import InfiniteScroll from 'react-infinite-scroll-component';
import Loading from '../../../components/Loading';

const AllMeals = () => {
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState(""); // Debounced search state
    const [category, setCategory] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [page, setPage] = useState(1);

    const { data, isLoading, error } = useMeals({
        search: debouncedSearch,
        category,
        minPrice,
        maxPrice,
        page,
        limit: 10,
    });
    const [isAdmin, isAdminLoading] = useAdmin();
    const { pathname } = useLocation();

    const meals = data?.data || [];
    const pagination = data?.pagination || {};

    // Debounce the search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search); // Update debouncedSearch after 500ms
        }, 500);

        return () => clearTimeout(timer); // Cleanup the timer on unmount or input change
    }, [search]);

    const loadMoreMeals = () => {
        if (pagination.page < pagination.totalPages) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    if (isLoading && page === 1) {
        return <Loading></Loading>
    }

    if (error) {
        return <div>Error loading meals: {error.message}</div>;
    }

    // if (!isLoading && meals.length === 0) {
    //     return <p>No meals found</p>;
    // }

    return (
        <>
            {pathname !== "/dashboard/allmeals" ? (
                <div className="mx-auto max-w-7xl my-4">
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Search meals..."
                            className="input mr-2 input-bordered w-full max-w-md mb-2"
                            value={search}
                            onChange={(e) => {
                                setPage(1);
                                setSearch(e.target.value); // Update the search input
                            }}
                        />
                        <select
                            className="select select-bordered w-full max-w-md mb-2"
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
                        <div>
                            <p className="my-4">Sort by Price:</p>
                            <div className="flex gap-4">
                                <input
                                    type="number"
                                    placeholder="Min Price"
                                    className="input input-bordered"
                                    value={minPrice}
                                    onChange={(e) => {
                                        setPage(1);
                                        setMinPrice(e.target.value);
                                    }}
                                />
                                <input
                                    type="number"
                                    placeholder="Max Price"
                                    className="input input-bordered"
                                    value={maxPrice}
                                    onChange={(e) => {
                                        setPage(1);
                                        setMaxPrice(e.target.value);
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {meals.length > 0 ?
                        (
                            <InfiniteScroll
                                dataLength={meals.length}
                                next={loadMoreMeals}
                                hasMore={pagination.page < pagination.totalPages}
                                loader={<p>Loading more meals...</p>}
                            // endMessage={<p>No more meals to load</p>}
                            >
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {meals.map((meal) => (
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
                                        </div>
                                    ))}
                                </div>
                            </InfiniteScroll>
                        ) : (<p className='text-center text-red-500 font-extrabold text-3xl my-28'>No Meals Found named: <span className='text-green-700'>{search}</span></p>)
                    }
                </div>
            ) : (
                <MealsTable />
            )}
        </>
    );
};

export default AllMeals;