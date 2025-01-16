import React, { useContext, useState } from 'react';
import Swal from 'sweetalert2';
import { AuthContext } from '../providers/AuthProvider';
import useAxiosSecure from '../hooks/useAxiosSecure';
import usePremiumMember from '../hooks/usePremiumMember';
import Loading from './Loading';

const RequestButton = ({ meal }) => {

    const { user } = useContext(AuthContext);

    const [isPremiumMember, isMemberLoading] = usePremiumMember();

    if (isMemberLoading) {
        return <Loading></Loading>
    }

    const [isRequested, setIsRequested] = useState(false);

    const axiosSecure = useAxiosSecure();

    const like = meal?.reaction?.count;

    const { reaction, ...extractedMeal } = meal;

    console.log(extractedMeal);

    const requestedMeal = {

        ...extractedMeal,
        userEmail: user?.email,
        name: user?.displayName,
        like: like,
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
            {
                isPremiumMember ? (<button
                    onClick={handleRequestMeal}
                    disabled={isRequested}
                    className={`btn ${isRequested ? 'btn-disabled' : 'btn-primary'}`}
                >
                    {isRequested ? 'Requested' : 'Request a Meal'}
                </button>) : (
                    <button
                        onClick={() =>
                            Swal.fire({
                                icon: 'info',
                                title: 'Subscription Required',
                                text: 'You need to subscribe to request meals.',
                                confirmButtonText: 'Subscribe Now',
                            })
                        }
                        className="btn btn-secondary"
                    >
                        Subscribe Now
                    </button>
                )
            }
        </div >
    );
};

export default RequestButton;