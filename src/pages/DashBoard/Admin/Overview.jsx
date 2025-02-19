import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import axios from "axios";

const Overview = () => {
    const [stats, setStats] = useState({
        totalMeals: 0,
        totalUsers: 0,
        totalReviews: 0,
        categoryStats: [],
        reactionStats: [],
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get("https://hostel-management-server-orcin.vercel.app/overview-stats");
                setStats(response.data);
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        };
        fetchStats();
    }, []);

    console.log(stats);

    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Dashboard Overview</h2>

            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-blue-500 text-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold">Total Meals</h3>
                    <p className="text-3xl font-bold">{stats.totalMeals}</p>
                </div>
                <div className="bg-green-500 text-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold">Total Users</h3>
                    <p className="text-3xl font-bold">{stats.totalUsers}</p>
                </div>
                <div className="bg-yellow-500 text-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold">Total Reviews</h3>
                    <p className="text-3xl font-bold">{stats.totalReviews}</p>
                </div>
            </div>

            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4">Meals by Category</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={stats.categoryStats}>
                            <XAxis dataKey="category" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4">Reactions Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={stats.reactionStats} cx="50%" cy="50%" outerRadius={100} fill="#82ca9d" dataKey="count" label>
                                {stats.reactionStats.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Overview;
