import React, { useContext, useState } from 'react';
import SectionHeading from '../../../components/SectionHeading';
import { useForm } from 'react-hook-form';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { AuthContext } from '../../../providers/AuthProvider';
import { imageUpload } from '../../../api/utils';

const AddMeal = () => {

    const { user, notificationCount, setNotificationCount } = useContext(AuthContext);
    const [buttonText, setButtonText] = useState('Add'); 

    const axiosSecure = useAxiosSecure();

    const getBDTTime = () => {
        const now = new Date();
        const utcOffset = now.getTimezoneOffset() * 60000; 
        const bdtOffset = 6 * 60 * 60000; 
        const bdtDate = new Date(now.getTime() + utcOffset + bdtOffset);

        const year = bdtDate.getFullYear();
        const month = String(bdtDate.getMonth() + 1).padStart(2, "0"); 
        const day = String(bdtDate.getDate()).padStart(2, "0");
        const hours = String(bdtDate.getHours()).padStart(2, "0");
        const minutes = String(bdtDate.getMinutes()).padStart(2, "0");

        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const incrementNotification = () => {
        console.log("Clicked for noti");
        setNotificationCount((prevCount) => prevCount + 1);
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();


    const onSubmit = async (data) => {

        setButtonText('Adding');
        
        const formattedPostTime = data.postTime.replace("T", " "); 

            const imageFile = data.image[0]; 

            const imageURL = await imageUpload(imageFile);
            console.log('Uploaded Image URL:', imageURL);

        console.log(data);

        const { price, image, ...newData } = data;

        const reaction = {
            count: 0,
            userEmails: []
        }

        const reviews = {
            review_count: 0,
            reviews: [],
        }

        const mealData = {
            ...newData,
            price: parseInt(price),
            image: imageURL,
            reaction: reaction,
            reviews: reviews,
            rating: 0,
        }
        console.log(mealData);

        const mealRes = await axiosSecure.post('/meals', mealData)
        
        if (mealRes.data.insertedId) {
            Swal.fire({
                position: "top",
                icon: "success",
                title: `Add a meal successfully`,
                showConfirmButton: false,
                timer: 1500
            })
            incrementNotification();
            setButtonText('Added');
        }

    };

    return (
        <div className='w-[90%] mx-auto my-6'>
            <SectionHeading title="Add a Meal"></SectionHeading>
            <form onSubmit={handleSubmit(onSubmit)} className="md:grid space-y-2 md:space-y-0 block md:grid-cols-2 md:gap-4">
            
                {/* Title */}
                <div className=''>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                        type="text"
                        {...register("title", { required: "Title is required" })}
                        className="input input-bordered w-full"
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                </div>

                {/* Category */}
                <div>
                    <label className="block mb-2 md:mb-0 text-sm font-medium text-gray-700">Category</label>
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

                <div className='col-span-2 mx-auto'>
                    <button type="submit" className="btn btn-primary w-xsm" disabled={buttonText === 'Adding'}>
                        {buttonText} 
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddMeal;