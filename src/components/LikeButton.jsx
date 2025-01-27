import React, { useContext, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { AuthContext } from '../providers/AuthProvider';
import { AiFillLike } from "react-icons/ai";

const LikeButton = ({ mealId, userEmails, initialReaction }) => {

    const { user } = useContext(AuthContext);
    console.log(userEmails);
    const userEmail = user?.email

    const [reactionCount, setReactionCount] = useState(initialReaction || 0);
    const [hasLiked, setHasLiked] = useState(
        userEmails?.includes(user?.email) || false
    );

    const handleLike = async () => {
        if (hasLiked) return; // Prevent multiple likes from the same user

        try {
            const response = await axios.put(
                `https://hostel-management-server-orcin.vercel.app/meals/${mealId}/like`,
                { userEmail }
            );

            // Update reaction count and set hasLiked
            setReactionCount(response.data?.reaction?.count);
            setHasLiked(true);
        } catch (error) {
            Swal.fire({
                title: "info!",
                text: `You (${user?.displayName}) already liked this meal`,
                icon: "info"
            });
            console.error("This", error.response?.data?.message || error.message);
        }
    };

    return (
        <>
            <div className='flex gap-1'>
                <button
                    onClick={handleLike}
                    disabled={hasLiked}
                    className=""
                >
                    <AiFillLike className='' />
                </button>
                    <p>{reactionCount}</p>
            </div>
        </>
    );
};

export default LikeButton;