import { useContext, useState } from "react";
import { AuthContext } from "../providers/AuthProvider";
import Swal from "sweetalert2";
import useAxiosSecure from "../hooks/useAxiosSecure";
import Loading from "./Loading";
import usePremiumMember from "../hooks/usePremiumMember";
import { BiSolidLike } from "react-icons/bi";


const LikeButtonUpcomingMeal = ({ meal, userEmails, initialReaction, onReactionUpdate, refetchAllUpcoming }) => {
    const { user, notificationCount, setNotificationCount } = useContext(AuthContext);
    const userEmail = user?.email;

    const axiosSecure = useAxiosSecure();

    const { data: isPremiumMember } = usePremiumMember();

    // if (isLoading) {
    //     return <Loading></Loading>
    // }

    console.log(isPremiumMember);

     
    // Function to increment the notification count
    const incrementNotification = () => {
        console.log("Clicked for noti");
        setNotificationCount((prevCount) => prevCount + 1);
    };

    const [reactionCount, setReactionCount] = useState(initialReaction || 0);
    const [hasLiked, setHasLiked] = useState(userEmails?.includes(userEmail) || false);

    const handleLike = async () => {
        if (!userEmail || hasLiked) return;

            // API call to update likes
            await axiosSecure.put(`/upcomingmeals/${meal._id}/like`, { userEmail });
            setReactionCount(reactionCount + 1);
            incrementNotification();
            setHasLiked(true);

            // Notify parent about the new reaction count
            onReactionUpdate(reactionCount + 1);
            refetchAllUpcoming();
    };

    const handleClick = () => {
        handleLike();
        refetchAllUpcoming();
    };


    return (
        <div className="text-center mt-1">
            <button
                className="text-xl"
                onClick={handleClick}
                disabled={hasLiked}
            >
                <BiSolidLike />

            </button>
        </div>
    );
};

export default LikeButtonUpcomingMeal;
