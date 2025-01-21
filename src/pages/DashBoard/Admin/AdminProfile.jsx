import React, { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { AuthContext } from '../../../providers/AuthProvider';

const AdminProfile = () => {
    const axiosSecure = useAxiosSecure();
    const {user} = useContext(AuthContext);

    const { data: adminData, isLoading, isError, error } = useQuery({
        queryKey: ['adminData'],
        queryFn: async () => {
            const response = await axiosSecure.get(`/admin-data?adminEmail=${user?.email}`);
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
        <div className="card w-96 bg-base-100 shadow-xl">
            <figure>
                <img src={user?.photoURL} alt={`${user?.displayName}'s profile`} className="w-24 h-24 rounded-full mt-4" />
            </figure>
            <div className="card-body">
                <h2 className="card-title text-center">{user?.displayName}</h2>
                <p className="text-center">{user?.email}</p>
                <p className="text-center font-bold">Meals Added: {adminData?.mealCount}</p>
            </div>
        </div>
    );
};

export default AdminProfile;
