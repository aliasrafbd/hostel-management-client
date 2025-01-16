import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchMeals = async () => {
    const response = await axios.get('http://localhost:5000/meals');
    return response.data; // Ensure this returns an array
};

const useMeals = () => {
    const { data = [], isLoading, error } = useQuery({
        queryKey: ['data'], // Unique key for caching
        queryFn: fetchMeals, // Function to fetch meals
    });

    return { data, isLoading, error };
};


export default useMeals;