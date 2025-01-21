import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchMeals = async ({ search, category, minPrice, maxPrice }) => {
    const response = await axios.get("http://localhost:5000/meals", {
        params: { search, category, minPrice, maxPrice },
    });
    return response.data;
};

const useMeals = ({ search = "", category = "", minPrice = "", maxPrice = "" }) => {
    const { data = [], isLoading, error, refetch } = useQuery({
        queryKey: ['meals', search, category, minPrice, maxPrice],
        queryFn: () => fetchMeals({ search, category, minPrice, maxPrice }),
        keepPreviousData: true,
    });

    return { data, isLoading, error, refetch };
};

export default useMeals;


