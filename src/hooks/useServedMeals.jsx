import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// Function to fetch requested meals by name and userEmail
const fetchRequestedMeals = async ({ name, userEmail }) => {
    try {
        const response = await axios.get("http://localhost:5000/requestedmeals", {
            params: { name, userEmail },
        });
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            // Throw the custom message from the backend
            throw new Error(error.response.data.message || 'Something went wrong');
        }
        throw error;
    }
};

// Custom Hook for fetching and modifying requested meals
const useServedMeals = ({ name = "", userEmail = "" }) => {
    const { data = [], isLoading, error, refetch } = useQuery({
        queryKey: ['requested-meals', name, userEmail],
        queryFn: () => fetchRequestedMeals({ name, userEmail }),
        keepPreviousData: true,
    });

    // Map over the data to update status and remove _id
    const updatedData = data.map(({ _id, ...item }) => ({
        ...item,
        status: item.status === "pending" ? "delivered" : item.status,
    }));

    return { data: updatedData, isLoading, error, refetch };
};

export default useServedMeals;