import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchMealById = async (mealId) => {
  const response = await axios.get(`https://hostel-management-server-orcin.vercel.app/meal/${mealId}`);
  return response.data;
};

const useUpcomingMeal = (mealId) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['meal', mealId], 
    queryFn: () => fetchMealById(mealId), 
    enabled: !!mealId, 
    keepPreviousData: true, 
  });

  return { data, isLoading, error, refetch };
};

export default useUpcomingMeal;
