import React, { useContext, useState } from "react";
import { AuthContext } from "../../../providers/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const ServeMeals = () => {
    const { user, loading } = useContext(AuthContext);
    const [name, setName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ["servedMeals", currentPage, itemsPerPage, name, userEmail],
        queryFn: async () => {
            const response = await fetch(
                `https://hostel-management-server-orcin.vercel.app/servedmeals?page=${currentPage}&size=${itemsPerPage}&name=${name}&userEmail=${userEmail}`
            );
            if (!response.ok) {
                throw new Error("Failed to fetch meals.");
            }
            return response.json();
        },
        keepPreviousData: true,
    });

    const { meals = [], totalCount = 0 } = data || {};
    const totalPages = Math.ceil(totalCount / itemsPerPage);

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1); // Reset to first page for new search
        refetch();
    };

    const handleServe = async (mealId) => {
        try {
            const response = await axios.patch(`https://hostel-management-server-orcin.vercel.app/servedmeals/${mealId}`, {
                status: "delivered",
            });
    
            if (response.status === 200) {
                console.log("Meal status updated successfully.");
                refetch(); // Refetch the meals to update the table
            } else {
                console.error("Failed to update meal status.");
            }
        } catch (error) {
            console.error("Error updating meal status:", error.message);
        }
    };


    return (
        <div>
            {/* Search Form */}
            <form onSubmit={handleSearch} className="mb-4 flex gap-4">
                <input
                    type="text"
                    placeholder="Search by name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input input-bordered"
                />
                <input
                    type="email"
                    placeholder="Search by user email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="input input-bordered"
                />
                <button type="submit" className="btn btn-primary">Search</button>
            </form>

            {/* Table with fixed height and overflow */}
            <div className="border rounded-lg shadow-lg h-[600px] overflow-y-auto">
                <table className="table-auto w-full bg-white">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="py-2 px-4">#</th>
                            <th className="py-2 px-4">Meal Title</th>
                            <th className="py-2 px-4">User Name</th>
                            <th className="py-2 px-4">User Email</th>
                            <th className="py-2 px-4">Status</th>
                            <th className="py-2 px-4">Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-center">
                        {!isLoading && meals.length > 0 ? (
                            meals.map((meal, index) => (
                                <tr key={meal._id} className="hover:bg-gray-100">
                                    <td className="py-2 px-4">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                    <td className="py-2 px-4">{meal.title}</td>
                                    <td className="py-2 px-4">{meal.name}</td>
                                    <td className="py-2 px-4">{meal.userEmail}</td>
                                    <td className="py-2 px-4">{meal.status}</td>
                                    <td className="py-2 px-4">
                                        <button
                                            className="btn btn-error btn-sm"
                                            onClick={() => handleServe(meal._id)}
                                            disabled={meal.status === "delivered"} // Disable if already delivered
                                        >
                                            {meal.status === "pending" ? "Serve" : "Delivered"}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="py-4 text-center text-gray-500">
                                    {isLoading ? "Loading..." : "No meals found."}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center items-center gap-4 mt-4">
                <button
                    className={`btn btn-outline btn-sm ${currentPage === 1 && "btn-disabled"}`}
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                >
                    Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i}
                        className={`btn btn-sm ${currentPage === i + 1 ? "btn-active" : "btn-outline"}`}
                        onClick={() => setCurrentPage(i + 1)}
                    >
                        {i + 1}
                    </button>
                ))}
                <button
                    className={`btn btn-outline btn-sm ${currentPage === totalPages && "btn-disabled"}`}
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default ServeMeals;
