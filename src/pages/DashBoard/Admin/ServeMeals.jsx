import React, { useContext, useEffect, useState } from 'react';
import useServedMeals from '../../../hooks/useServedMeals';
import { AuthContext } from '../../../providers/AuthProvider';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';

const ServeMeals = () => {

    const { user } = useContext(AuthContext);

    const [name, setName] = useState("")
    const [userEmail, setUserEmail] = useState("");
    const axiosSecure = useAxiosSecure();

    // Using the custom hook
    const { data: updatedData, isLoading, error, refetch } = useServedMeals({ name, userEmail });

    console.log(updatedData);
    // if (error) return <div>Error: {error.message}</div>;
    // const [updatedServedMeals, setUpdatedServedMeals] = useState(servedMeals)

    // const {title, category, ingredients, description, price, image, status} = servedMeals;


    // Function to insert updated meals into the database
    // const insertServedMeals = async (meals) => {
    //     try {
    //         const response = await axiosSecure.post("http://localhost:5000/insert-served-meals", { meals });
    //         Swal.fire('Success', response.data.message, 'success');
    //     } catch (error) {
    //         Swal.fire('Error', 'Failed to insert meals', 'error');
    //         console.error('Error inserting meals:', error);
    //     }
    // };

    // // Automatically insert meals when updatedData changes
    // useEffect(() => {
    //     if (updatedData && updatedData.length > 0) {
    //         // Insert the meals with the updated status (already set to 'delivered' in the hook)
    //         insertServedMeals(updatedData);
    //     }
    // }, [updatedData]); // Runs only when updatedData changes


    const handleSearch = () => {
        refetch();
    };


    return (
        <div>
            <form onSubmit={handleSearch} className="mb-4">
                <input
                    type="text"
                    placeholder="Search by name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input input-bordered"
                />
                <input
                    type="email"
                    placeholder="Search by user email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="input input-bordered ml-2"
                />
                {/* <button onClick={handleSearch} className="btn btn-primary ml-2">
                    Search
                </button> */}
            </form>

            {isLoading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error.message}</p>}

            {!isLoading && !error && updatedData?.length > 0 && (
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>User Email</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {updatedData?.map((meal, index) => (
                            <tr key={meal._id}>
                                <td>{index + 1}</td>
                                <td>{meal.name}</td>
                                <td>{meal.userEmail}</td>
                                <td>{meal.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {!isLoading && !error && updatedData?.length === 0 && (
                <p>No meals found.</p>
            )}
        </div>
    );
};

export default ServeMeals;