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
                `http://localhost:5000/meals/${mealId}/like`,
                { userEmail }
            );

            // Update reaction count and set hasLiked
            setReactionCount(response.data.reaction.count);
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
            <div className='flex items-center gap-1'>
                <AiFillLike className='' />
                <p>{reactionCount}</p>
            </div>
            <button
                onClick={handleLike}
                disabled={hasLiked}
                className={`px-4 py-2 text-white font-semibold rounded ${hasLiked ? 'bg-gray-700' : 'bg-blue-500 hover:bg-blue-600'
                    }`}
            >
                Like
            </button>
        </>
    );
};

export default LikeButton;