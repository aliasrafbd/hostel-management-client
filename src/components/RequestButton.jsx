import React, { useContext, useState } from 'react';
import Swal from 'sweetalert2';
import { AuthContext } from '../providers/AuthProvider';
import useAxiosSecure from '../hooks/useAxiosSecure';
import usePremiumMember from '../hooks/usePremiumMember';
import Loading from './Loading';

const RequestButton = ({ meal }) => {

    console.log(meal);
    
    const { user } = useContext(AuthContext);

    // const [isPremiumMember, isMemberLoading] = usePremiumMember(true);

    // if (isMemberLoading) {
    //     return <Loading></Loading>
    // }

    const [isRequested, setIsRequested] = useState(false);

    const axiosSecure = useAxiosSecure();

    const like = meal?.reaction?.count;

    const { reaction, _id, ...extractedMeal } = meal;

    console.log(extractedMeal);

    const requestedMeal = {

        ...extractedMeal,
        userEmail: user?.email,
        name: user?.displayName,
        reaction: like,
        status: "pending",
    }

    const handleRequestMeal = async () => {
        try {
            const mealRes = await axiosSecure.post('/requestedmeals', requestedMeal)
            if (mealRes.data.insertedId) {
                setIsRequested(true);
                Swal.fire({
                    position: "top",
                    icon: "success",
                    title: `Added this meal to request collection, successfully`,
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        }
        catch (error) {
            Swal.fire({
                position: "top",
                icon: "info",
                title: `You have already requested this meal`,
                showConfirmButton: false,
                timer: 1500

                    || error
            });
        }
    }

    // console.log(requestedMeal);

    return (
        <div>
                <button
                    onClick={handleRequestMeal}
                    disabled={isRequested}
                    className={`btn my-2 ${isRequested ? 'btn-disabled' : 'btn-primary'}`}
                >
                    {isRequested ? 'Requested' : `Request ${meal.title}`}
                </button>
                
        </div >
    );
};

export default RequestButton;