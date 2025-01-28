import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchRequestedMeals = async ({ name, userEmail }) => {
    try {
        const response = await axios.get("https://hostel-management-server-orcin.vercel.app/requestedmeals", {
            params: { name, userEmail },
        });
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data.message || 'Something went wrong');
        }
        throw error;
    }
};

const useServedMeals = ({ name = "", userEmail = "" }) => {
    const { data = [], isLoading, error, refetch } = useQuery({
        queryKey: ['requested-meals', name, userEmail],
        queryFn: () => fetchRequestedMeals({ name, userEmail }),
        keepPreviousData: true,
    });

    const updatedData = data.map(({ _id, ...item }) => ({
        ...item,
        status: item.status === "pending" ? "delivered" : item.status,
    }));
    

    return { data: updatedData, isLoading, error, refetch };
};

export default useServedMeals;