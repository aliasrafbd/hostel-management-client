import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// Fetch function to get a single meal by its ID
const fetchMealById = async (mealId) => {
  const response = await axios.get(`http://localhost:5000/meal/${mealId}`);
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
