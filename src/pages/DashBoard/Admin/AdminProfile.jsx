import React, { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { AuthContext } from '../../../providers/AuthProvider';

const AdminProfile = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useContext(AuthContext);

    const { data: adminData, isLoading, isError, error } = useQuery({
        queryKey: ['adminData'],
        queryFn: async () => {
            const response = await axiosSecure.get(`/admin-data?adminEmail=${user?.email}`);
            return response.data;
        },
        enabled: !!user?.email, 
    });

    if (isLoading) {
        return <div className="text-center text-lg mt-10">Loading...</div>;
    }

    if (isError) {
        console.error('Error fetching admin data:', error);
        return <div className="text-center text-red-500 mt-10">Error: Failed to load admin data.</div>;
    }

    return (
        <div className="max-w-5xl mx-auto p-6 mt-8">
            {/* Admin Profile Details */}
            <div className="p-6 flex flex-col md:flex-row items-center gap-6">
                <div className="w-32 h-32 rounded-full border-4 border-blue-500 overflow-hidden">
                    <img src={user?.photoURL} alt="Admin" className="object-cover w-full h-full" />
                </div>
                <div className="text-center md:text-left">
                    <h2 className="text-2xl font-bold text-gray-800">{user?.displayName}</h2>
                    <p className="text-gray-600">{user?.email}</p>
                    <p className="text-gray-700 mt-2 font-medium">Total Meals Added: 
                        <span className="text-blue-600"> {adminData?.mealCount}</span>
                    </p>
                </div>
            </div>

            {/* Recent Activity Section */}
            <div className="mt-10">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
                {adminData?.recentMeals?.length > 0 ? (
                    <div className="bg-white shadow-lg rounded-lg p-6">
                        <ul className="space-y-4">
                            {adminData.recentMeals.map((meal, index) => (
                                <li key={index} className="border-b pb-3">
                                    <p className="text-lg font-semibold">{meal.title}</p>
                                    <p className="text-gray-600">Added on: {new Date(meal.postTime).toLocaleString()}</p>
                                    <p className="text-gray-500">Category: {meal.category}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <p className="text-gray-600 text-center mt-4">No recent activity available.</p>
                )}
            </div>
        </div>
    );
};

export default AdminProfile;