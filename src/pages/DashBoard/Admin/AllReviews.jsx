import React, { useContext } from 'react';
import { AuthContext } from '../../../providers/AuthProvider';
import useMeals from '../../../hooks/useMeals';

const AllReviews = () => {


    // {
    //     "_id": "6787cc46e3d14dee557d3f00",
    //     "title": "a",
    //     "category": "Lunch",
    //     "ingredients": "fd",
    //     "description": "fd",
    //     "postTime": "2025-01-15T20:54",
    //     "distributorName": "Ali Asraf",
    //     "distributorEmail": "aliasraf.bd@gmail.com",
    //     "price": 43,
    //     "image": "https://i.ibb.co/4SkDJxg/Dinner-Halim.jpg",
    //     "reaction": {
    //         "count": 1,
    //         "userEmails": [
    //             "ps.aliasraf@gmail.com"
    //         ]
    //     },
    //     "review": 0,
    //     "rating": 3.029253214597702
    // }

    const {minPrice, setMinPrice, maxPrice, setMaxPrice, category, search} = useContext(AuthContext);
    const { data: meals, isLoading, error } = useMeals({ search, category, minPrice, maxPrice });

    console.log(meals);

    // Handler for deleting a review
    const handleDelete = (id) => {
        console.log(`Delete review with ID: ${id}`);
        // Add your delete logic here
    };

    // Handler for viewing a meal
    const handleViewMeal = (id) => {
        console.log(`View meal with ID: ${id}`);
        // Add your navigation logic here
    };

    return (
        <>
            <div className="p-6">
                <h1 className="text-2xl text-center font-bold mb-4">Meal Reviews</h1>
                <div className="overflow-x-auto">
                    <table className="table-auto w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-300 px-4 py-2">Title</th>
                                <th className="border border-gray-300 px-4 py-2">Reaction</th>
                                <th className="border border-gray-300 px-4 py-2">Rating</th>
                                <th className="border border-gray-300 px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {meals.data?.map((meal) => (
                                <tr key={meal._id} className="hover:bg-gray-50">
                                    <td className="border border-gray-300 px-4 py-2">{meal.title}</td>
                                    <td className="border border-gray-300 px-4 py-2">{meal.reaction.count}</td>
                                    <td className="border border-gray-300 px-4 py-2">{meal.rating} ⭐</td>
                                    <td className="border border-gray-300 px-4 py-2 flex gap-2">
                                        <button
                                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                            onClick={() => handleDelete(meal._id)}
                                        >
                                            Delete
                                        </button>
                                        <button
                                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                            onClick={() => handleViewMeal(meal._id)}
                                        >
                                            View Meal
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default AllReviews;