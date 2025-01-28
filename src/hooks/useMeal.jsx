import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// Fetch function to get a single meal by its ID
const fetchMealById = async (mealId) => {
    console.log(`Frontend URL: https://hostel-management-server-orcin.vercel.app/meal/${mealId}`); // Debug the URL
    const response = await axios.get(`https://hostel-management-server-orcin.vercel.app/meal/${mealId}`);
    return response.data;
  };

const useMeal = (mealId) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['meal', mealId], 
    queryFn: () => fetchMealById(mealId), 
    enabled: !!mealId, 
    keepPreviousData: true, 
  });

  return { data, isLoading, error, refetch };
};

export default useMeal;
