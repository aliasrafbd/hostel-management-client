import { useState, useEffect } from 'react';
import axios from 'axios';

const useMeals = ({ search, category, minPrice, maxPrice, page, limit }) => {
    const [data, setData] = useState({ data: [], pagination: {} });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMeals = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get("https://hostel-management-server-orcin.vercel.app/meals", {
                    params: { search, category, minPrice, maxPrice, page, limit }, 
                    withCredentials: true
                });

                setData((prevData) => ({
                    data: page === 1
                        ? response.data.data // Replace data if it's the first page
                        : [...prevData.data, ...response.data.data], // Append new data
                    pagination: response.data.pagination,
                }));
            } catch (err) {
                setError(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMeals();
    }, [search, category, minPrice, maxPrice, page, limit]);

    return { data, isLoading, error };
};

export default useMeals;
