import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchUpcomingMeals = async () => {
    const response = await axios.get('https://hostel-management-server-orcin.vercel.app/upcomingmeals');
    return response.data;
};

export const useUpcomingMeals = () => {
    const { data = [], isLoading, error, refetch } = useQuery({
        queryKey: ['upcomingMeals'],
        queryFn: fetchUpcomingMeals,
        staleTime: 5000, 
    });

    return { data, isLoading, error, refetch };
};
