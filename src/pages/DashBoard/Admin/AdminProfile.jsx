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
            const response = await axiosSecure.get(`/admin-data?adminEmail=${user?.email}`, {withCredentials:true});
            return response.data;
        },
        enabled: !!user?.email, // Ensure the query only runs if adminId is provided
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        console.error('Error fetching admin data:', error);
        return <div>Error: Failed to load admin data.</div>;
    }

    return (
        <div className="card md:w-96 w-60 mx-auto mt-6 pt-20 bg-gradient-to-r from-blue-50 to-blue-100 shadow-2xl rounded-xl overflow-hidden">
            <div className="flex flex-col items-center -mt-14">
                <div className="w-28 h-28 rounded-full border-4 border-white shadow-md overflow-hidden">
                    <img
                        src={user?.photoURL}
                        className="object-cover w-full h-full"
                    />
                </div>
                <div className="mt-4 text-center">
                    <h2 className="text-xl font-bold text-gray-800">{user?.displayName}</h2>
                    <p className="text-gray-500">{user?.email}</p>
                </div>
            </div>
            <div className="card-body mt-4">
                <p className="text-center font-bold text-lg text-gray-700">
                    Meals Added: <span className="text-blue-600">{adminData?.mealCount}</span>
                </p>
            </div>
        </div>

    );
};

export default AdminProfile;
