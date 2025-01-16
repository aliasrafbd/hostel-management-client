import React, { useContext, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { AuthContext } from '../providers/AuthProvider';

const LikeButton = ({ mealId, userEmail, initialReaction }) => {

    const { user } = useContext(AuthContext);

    const [reactionCount, setReactionCount] = useState(initialReaction?.count || 0);
    const [hasLiked, setHasLiked] = useState(
        initialReaction?.userEmails?.includes(userEmail) || false
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
            <p>Like: {reactionCount}</p>
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