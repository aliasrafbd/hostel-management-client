import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { AuthContext } from "../providers/AuthProvider";
import { imageUpload } from "../api/utils";

const AddMealWithModal = ({ closeModal, refetch }) => {

    const axiosSecure = useAxiosSecure();
    const [buttonText, setButtonText] = useState('Add');

    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const { user } = useContext(AuthContext);

    const reaction = {
        count: 0,
        userEmails: []
    }

    const reviews = {
        review_count: 0,
        reviews: [],
    }


    const onSubmit = async (data) => {
        setButtonText('Adding');

        try {
            console.log(data);
            const imageURL = await imageUpload(data.image[0]);
            console.log(imageURL);

            const mealData = {
                ...data,
                price: parseFloat(data.price),
                image: imageURL,
                reaction: reaction,
                reviews: reviews,
                rating: 0,
            };

            const response = await axiosSecure.post('/upcomingmeals', mealData);

            if (response.data.insertedId) {
                Swal.fire({
                    position: "top",
                    icon: "success",
                    title: "Meal added successfully!",
                    showConfirmButton: false,
                    timer: 1500,
                });

                if (refetch) {
                    refetch();
                }

                closeModal();
                reset();
            }
        } catch (error) {
            console.error("Error adding meal:", error);
            Swal.fire({
                position: "top",
                icon: "error",
                title: "Failed to add meal",
                text: "Please try again later.",
                showConfirmButton: true,
            });
        }
    };

    return (
        <div className="modal modal-open">
            <div className="modal-box w-full max-w-2xl">
                <h3 className="font-bold text-lg mb-4">Add a Meal</h3>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Title */}
                    <input
                        type="text"
                        {...register("title", { required: "Title is required" })}
                        className="input input-bordered w-full"
                        placeholder="Title"
                    />
                    {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}

                    {/* Category */}
                    <select
                        {...register("category", { required: "Category is required" })}
                        className="select select-bordered w-full"
                    >
                        <option value="" disabled>Select Category</option>
                        <option value="Breakfast">Breakfast</option>
                        <option value="Lunch">Lunch</option>
                        <option value="Dinner">Dinner</option>
                    </select>
                    {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}

                    {/* Ingredients */}
                    <textarea
                        {...register("ingredients", { required: "Ingredients are required" })}
                        className="textarea textarea-bordered w-full"
                        placeholder="Ingredients"
                    ></textarea>
                    {errors.ingredients && <p className="text-red-500 text-sm">{errors.ingredients.message}</p>}

                    {/* Description */}
                    <textarea
                        {...register("description", { required: "Description is required" })}
                        className="textarea textarea-bordered w-full"
                        placeholder="Description"
                    ></textarea>
                    {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}

                    {/* Price */}
                    <input
                        type="number"
                        step="0.01"
                        {...register("price", { required: "Price is required" })}
                        className="input input-bordered w-full"
                        placeholder="Price"
                    />
                    {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}


                    {/* Distributor Name */}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">Distributor Name</label>
                        <input
                            type="text"
                            readOnly
                            defaultValue={user?.displayName}
                            {...register("distributorName", { required: "Distributor Name is required" })}
                            className="input input-bordered w-full"
                        />
                        {errors.distributorName && <p className="text-red-500 text-sm mt-1">{errors.distributorName.message}</p>}
                    </div>

                    {/* Distributor Email */}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">Distributor Email</label>
                        <input
                            type="email"
                            readOnly
                            defaultValue={user?.email}
                            {...register("distributorEmail", { required: "Distributor Email is required" })}
                            className="input input-bordered w-full"
                        />
                        {errors.distributorEmail && <p className="text-red-500 text-sm mt-1">{errors.distributorEmail.message}</p>}
                    </div>


                    {/* Image */}
                    <input
                        type="file"
                        {...register("image", { required: "Image is required" })}
                        className="file-input file-input-bordered w-full"
                    />
                    {errors.image && <p className="text-red-500 text-sm">{errors.image.message}</p>}

                    {/* Modal Actions */}
                    <div className="modal-action flex justify-center">
                        <button type="button" className="btn" onClick={closeModal}>
                            Cancel
                        </button>
                        <div className='col-span-2 mx-auto'>
                            <button type="submit" className="btn btn-primary w-xsm" disabled={buttonText === 'Adding'}>
                                {buttonText} 
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    ); 
};

export default AddMealWithModal;
