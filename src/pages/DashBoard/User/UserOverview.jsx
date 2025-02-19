import React, { useContext, useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from "recharts";
import axios from "axios";
import { AuthContext } from "../../../providers/AuthProvider";

const UserOverview = () => {
    const [requestedMeals, setRequestedMeals] = useState([]);
    const [reviews, setReviews] = useState([]);

    const {user} = useContext(AuthContext);

    console.log(user);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userEmail = user?.email; // Replace with dynamic user email

                // Fetch Requested Meals
                const mealsResponse = await axios.get(`https://hostel-management-server-orcin.vercel.app/requestedmeals/${userEmail}`);
                setRequestedMeals(mealsResponse.data);

                // Fetch Reviews
                const reviewsResponse = await axios.get(`https://hostel-management-server-orcin.vercel.app/reviews/${userEmail}`);
                setReviews(reviewsResponse.data);

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    // Total Requested Meals
    const totalRequestedMeals = requestedMeals.length;

    // Count meals by status
    const statusCounts = requestedMeals.reduce((acc, meal) => {
        acc[meal.status] = (acc[meal.status] || 0) + 1;
        return acc;
    }, {});

    const statusData = Object.keys(statusCounts).map((status) => ({
        name: status.charAt(0).toUpperCase() + status.slice(1),
        value: statusCounts[status],
    }));

    // Requested Meals by Category
    const categoryCounts = requestedMeals.reduce((acc, meal) => {
        acc[meal.category] = (acc[meal.category] || 0) + 1;
        return acc;
    }, {});

    const categoryData = Object.keys(categoryCounts).map((category) => ({
        category,
        count: categoryCounts[category],
    }));

    // Total Reviews
    const totalReviews = reviews.length;

    console.log(totalReviews);

    // Reviews Over Time
    const reviewsByDate = reviews.reduce((acc, review) => {
        const date = new Date(review.createdAt).toISOString().split("T")[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
    }, {});

    const reviewsData = Object.keys(reviewsByDate).map((date) => ({
        date,
        count: reviewsByDate[date],
    }));

    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">User Overview</h2>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-blue-500 text-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold">Requested Meals</h3>
                    <p className="text-3xl font-bold">{totalRequestedMeals}</p>
                </div>
                <div className="bg-green-500 text-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold">Total Reviews</h3>
                    <p className="text-3xl font-bold">{totalReviews}</p>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pie Chart: Requested Meals by Status */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4">Requested Meals Status</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={statusData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label>
                                {statusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Bar Chart: Meals by Category */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4">Meals by Category</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={categoryData}>
                            <XAxis dataKey="category" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Reviews Over Time Chart */}
            <div className="bg-white p-6 rounded-lg shadow-md mt-6">
                <h3 className="text-lg font-semibold mb-4">Reviews Over Time</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={reviewsData}>
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="count" stroke="#82ca9d" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default UserOverview;