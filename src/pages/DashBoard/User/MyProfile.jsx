import React, { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AuthContext } from '../../../providers/AuthProvider';
import axios from 'axios';

const fetchUserByEmail = async (email) => {
    try {
        const response = await axios.get(`http://localhost:5000/users/email/${email}`, {withCredentials: true});
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

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (!singleUser) {
        return <div>No user found!</div>;
    }

    return (
        <div className="profile max-w-md mx-auto p-4 mt-12 border rounded-lg shadow-lg">
            <h2 className="text-xl text-center font-bold mb-4">My Profile</h2>
            <img className='mx-auto h-48 w-48 rounded-full' src={user?.photoURL} alt="" />
            <p className="text-lg">
                <strong>Name:</strong> {singleUser.name}
            </p>
            <p className="text-lg">
                <strong>Email:</strong> {singleUser.email}
            </p>
            <p className="text-lg">
                <strong>Badge:</strong> {singleUser.badge}
            </p>
        </div>
    );
};

export default MyProfile;