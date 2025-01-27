import React, { useContext } from 'react';
import SectionHeading from '../../../components/SectionHeading';
import { useForm } from 'react-hook-form';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { AuthContext } from '../../../providers/AuthProvider';
import useMeal from '../../../hooks/useMeal';
import Loading from '../../../components/Loading';
import { useNavigate, useParams } from 'react-router-dom';
import { imageUpload } from '../../../api/utils';
import axios from 'axios';

const UpdateMeal = () => {

    const axiosSecure = useAxiosSecure();
    const { id } = useParams();
    const { user } = useContext(AuthContext);

    const { data:meal, isLoading, error, refetch } = useMeal(id)


    const navigate = useNavigate();

    if (isLoading) {
        return <Loading></Loading>;
    }
    if (!meal) {
        return <div>No meal found</div>; // Handle case where meal is not found
    }
    
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            title: meal.title,
            description: meal.description,
            ingredients: meal.ingredients,
            price: meal.price,
            category: meal.category,
            image: meal.image,
            distributorName: meal.distributorName,
            distributorEmail: meal.distributorEmail,
            postTime: meal.postTime,
        },
    });
    
    const getBDTTime = () => {
        const now = new Date();
        const utcOffset = now.getTimezoneOffset() * 60000; // Local offset in milliseconds
        const bdtOffset = 6 * 60 * 60000; // BDT is UTC+6
        const bdtDate = new Date(now.getTime() + utcOffset + bdtOffset);

        // Format date to YYYY-MM-DDTHH:mm
        const year = bdtDate.getFullYear();
        const month = String(bdtDate.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
        const day = String(bdtDate.getDate()).padStart(2, "0");
        const hours = String(bdtDate.getHours()).padStart(2, "0");
        const minutes = String(bdtDate.getMinutes()).padStart(2, "0");

        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };


    const {_id, title, category, ingredients, description, price, image, postTime, distributorName, distributorEmail } = meal;
    
    // const formattedPostTime = data.postTime.replace("T", " "); // Replace "T" with a space

    const onSubmit = async (data) => {

        const imageFile = data.image[0]; // Ensure this is a valid File object

        const imageURL = await imageUpload(imageFile);
        console.log('Uploaded Image URL:', imageURL);

        const {image, price, ...mealData} = data;

         const UpdatedNewMealData = {
            ...mealData,
            price: parseInt(price),
            image: imageURL,
        }

        console.log(UpdatedNewMealData);

        try {
            const response = await axios.put(`https://hostel-management-server-orcin.vercel.app/meals/${_id}`, UpdatedNewMealData);
            if (response.data.modifiedCount > 0) {
                Swal.fire({
                    title: "Success!",
                    text: "This meal Updated Successfully",
                    icon: "success",
                    confirmButtonText: "Close",
                });
                navigate("/dashboard");
            }
        } catch (error) {
            console.error("Error updating meal:", error);
        }
    };


    return (
        <div className='w-[90%] mx-auto my-6'>
            <SectionHeading title="Update Meal"></SectionHeading>
            <form onSubmit={handleSubmit(onSubmit)} className="gap-2 grid grid-cols-2">

                {/* Title */}
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Title</label>
                    <input
                        defaultValue={title}
                        type="text"
                        {...register("title", { required: "Title is required" })}
                        className="input input-bordered w-full"
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                </div>

                {/* Category */}
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Category</label>
                    <select defaultValue="default"
                        {...register("category", { required: "Category is required" })}
                        className="select select-bordered w-full"
                    >
                        <option disabled value="default">
                            Select a category
                        </option>
                        <option value="Breakfast">Breakfast</option>
                        <option value="Lunch">Lunch</option>
                        <option value="Dinner">Dinner</option>
                    </select>
                    {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
                </div>



                {/* Ingredients */}
                <div className='col-span-2'>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Ingredients</label>
                    <textarea
                        {...register("ingredients", { required: "Ingredients are required" })}
                        className="textarea textarea-bordered w-full"
                        rows="2"
                    ></textarea>
                    {errors.ingredients && <p className="text-red-500 text-sm mt-1">{errors.ingredients.message}</p>}
                </div>

                {/* Description */}
                <div className='col-span-2'>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        {...register("description", { required: "Description is required" })}
                        className="textarea textarea-bordered w-full"
                        rows="3"
                    ></textarea>
                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                </div>

                {/* Price */}
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Price</label>
                    <input
                        type="number"
                        step="0.01"
                        {...register("price", { required: "Price is required" })}
                        className="input input-bordered w-full"
                    />
                    {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
                </div>

                {/* Post Time */}
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Post Time</label>
                    <input
                        type="datetime-local"
                        {...register("postTime", { required: "Post time is required" })}
                        defaultValue={getBDTTime()} // Current date and time in BDT
                        className="input input-bordered w-full"
                    />
                    {errors.postTime && <p className="text-red-500 text-sm mt-1">{errors.postTime.message}</p>}
                </div>

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
                <div className='form-control w-full my-6'>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Upload Image</label>
                    <input type="file"
                        {...register("image", { required: "Image is required" })}
                        className="file-input w-full max-w-xs" />
                    {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>}
                </div>

                <div className='col-span-2'>
                    <button type="submit" className="btn btn-primary w-full">Submit</button>
                </div>
            </form>
        </div>
    );
};

export default UpdateMeal;