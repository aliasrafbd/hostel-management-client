import React, { useContext, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../../providers/AuthProvider";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from "recharts";

const fetchUserByEmail = async (userEmail) => {
    try {
        const response = await axios.get(`https://hostel-management-server-orcin.vercel.app/users/email/${userEmail}`, { withCredentials: true });
        return response.data;
    } catch (error) {
        throw error;
    }
};

const MyProfile = () => {
    const { user } = useContext(AuthContext);
    const userEmail = user?.email;

    const { data: singleUser, isLoading, error } = useQuery({
        queryKey: ['user', userEmail],
        queryFn: () => fetchUserByEmail(userEmail),
        enabled: !!userEmail,
        keepPreviousData: true,
    });

    const [requestedMeals, setRequestedMeals] = useState([]);
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!userEmail) return;

                
                const mealsResponse = await axios.get(`https://hostel-management-server-orcin.vercel.app/requestedmeals/${userEmail}`);
                setRequestedMeals(mealsResponse.data);

                
                const reviewsResponse = await axios.get(`https://hostel-management-server-orcin.vercel.app/reviews/${userEmail}`);
                setReviews(reviewsResponse.data);

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, [userEmail]);

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">Error: {error.message}</p>;
    if (!singleUser) return <p>No user found!</p>;

    
    const totalRequestedMeals = requestedMeals.length;
    const totalReviews = reviews.length;

    
    const statusCounts = requestedMeals.reduce((acc, meal) => {
        acc[meal.status] = (acc[meal.status] || 0) + 1;
        return acc;
    }, {});

    const statusData = Object.keys(statusCounts).map((status) => ({
        name: status.charAt(0).toUpperCase() + status.slice(1),
        value: statusCounts[status],
    }));

    
    const categoryCounts = requestedMeals.reduce((acc, meal) => {
        acc[meal.category] = (acc[meal.category] || 0) + 1;
        return acc;
    }, {});

    const categoryData = Object.keys(categoryCounts).map((category) => ({
        category,
        count: categoryCounts[category],
    }));

    
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
        <div className="mx-auto mt-12">
            
            <div className="flex justify-between mb-8">
                <div className="ml-4 text-left">
                    <img className="mx-auto h-24 w-24 rounded-full" src={user?.photoURL} alt="Profile" />
                </div>
                <div className="mt-4 w-1/2 text-right mr-8 space-y-2">
                    <p className="text-lg font-bold"><strong></strong> {singleUser.name}</p>
                    <p className="text-md"><strong></strong> {singleUser.email}</p>
                </div>
            </div>

            
            <div className="p-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-blue-500 text-white p-6 rounded-lg">
                        <h3 className="text-lg font-semibold">Requested Meals</h3>
                        <p className="text-3xl font-bold">{totalRequestedMeals}</p>
                    </div>
                    <div className="bg-green-500 text-white p-6 rounded-lg">
                        <h3 className="text-lg font-semibold">Total Reviews</h3>
                        <p className="text-3xl font-bold">{totalReviews}</p>
                    </div>
                </div>

                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
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
        </div>
    );
};

export default MyProfile;