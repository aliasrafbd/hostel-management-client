import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// Fetch function to get a single meal by its ID
const fetchMealById = async (mealId) => {
    console.log(`Frontend URL: https://hostel-management-server-orcin.vercel.app/meal/${mealId}`); // Debug the URL
    const response = await axios.get(`https://hostel-management-server-orcin.vercel.app/meal/${mealId}`);
    return response.data;
  };
  

// Custom hook to get a single meal
const useMeal = (mealId) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['meal', mealId], // Query key to uniquely identify the query
    queryFn: () => fetchMealById(mealId), // Fetch meal by its ID
    enabled: !!mealId, // Only run the query if mealId is provided
    keepPreviousData: true, // Optional, if you want to keep previous data while the query is refetched
  });

  return { data, isLoading, error, refetch };
};

export default useMeal;
