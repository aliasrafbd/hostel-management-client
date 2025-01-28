import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Lottie from 'lottie-react';
import LottieDataRegister from '../../assets/lottie/register-lottie.json';
import { AuthContext } from '../../providers/AuthProvider';
import Swal from 'sweetalert2';
import LoginWithGoogle from '../../components/LoginWithGoogle';
import useAxiosPublic from '../../hooks/useAxiosPublic';

function Register() {

    const axiosPublic = useAxiosPublic();

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const [error, setError] = useState({});

    const navigate = useNavigate();

    const { user, setUser, createANewUser, logOut, updateUserProfile, loading } = useContext(AuthContext);

    const onSubmit = (registerData) => {
        console.log("Register Data:", registerData);

        createANewUser(registerData.email, registerData.password)
            .then((result) => {
                setUser(result?.user)
                updateUserProfile({ displayName: registerData.displayName, photoURL: registerData.photoURL })
                    .then(() => {
                        // create user entry in the database
                        const userInfo = {
                            name: registerData.displayName,
                            email: registerData.email,
                            badge: "Bronze",
                        }
                        axiosPublic.post('/users', userInfo)
                            .then(res => {
                                if (res.data.insertedId) {
                                    reset();
                                    Swal.fire({
                                        title: 'New User Registered...',
                                        text: 'Please wait, we are navigating to home page',
                                        icon: 'info',
                                        timer: 1000,
                                        showConfirmButton: false,
                                        timerProgressBar: true,
                                    });
                                }

                            })

                    })
                    .catch((error) => {
                    })
                // logOut();
                // navigate("/login");

            })
            .catch((error) => {
                console.log(error);
                alert("User Registration error", error);
            });


    };

    return (
        <div className='register-bg h-[850px]'>
            <div className='register-overlay'></div>
            <div className="register-form top-[50%] w-[95%] md:w-[75%] lg:w-[65%] mx-auto">
                <h1 className='text-center font-bold md:text-4xl text-xl mb-6'>Welcome to <br /> <span className='text-orange-700'>Hostel Management System</span></h1>
                <h2 className='text-center font-bold text-3xl'>Register</h2>
                <hr className='my-4 max-w-3xl mx-auto border-slate-400 border-2' />
                <div className='flex gap-6'>
                    <div className='flex-1 flex flex-col justify-center'>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            {/* Name Input */}
                            <div className='text-left my-2'>
                                <label htmlFor="displayName">Name:</label>
                                <input
                                    type="text"
                                    id="displayName"
                                    placeholder="Enter your name"
                                    {...register('displayName', { required: "Name is required" })}
                                    className='rounded-md w-full'
                                    style={{ width: '100%', padding: '8px', fontSize: '14px' }}
                                />
                                {errors.displayName && <p style={{ color: 'red', fontSize: '12px' }}>{errors.displayName.message}</p>}
                            </div>

                            {/* Photo URL Input */}
                            <div className='text-left my-2'>
                                <label htmlFor="photoURL">Photo URL:</label>
                                <input
                                    type="url"
                                    id="photoURL"
                                    placeholder="Enter your photo URL"
                                    {...register('photoURL', {
                                        required: "Photo URL is required",
                                        // pattern: {
                                        //     value: /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif))$/i,
                                        //     message: "Invalid URL format"
                                        // }
                                    })}
                                    className='rounded-md'
                                    style={{ width: '100%', padding: '8px', fontSize: '14px' }}
                                />
                                {errors.photoURL && <p style={{ color: 'red', fontSize: '12px' }}>{errors.photoURL.message}</p>}
                            </div>

                            {/* Email Input */}
                            <div className='text-left my-2'>
                                <label htmlFor="email">Email:</label>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="Enter your email"
                                    {...register('email', {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Invalid email format"
                                        }
                                    })}
                                    className='rounded-md'
                                    style={{ width: '100%', padding: '8px', fontSize: '14px' }}
                                />
                                {errors.email && <p style={{ color: 'red', fontSize: '12px' }}>{errors.email.message}</p>}
                            </div>

                            {/* Password Input */}
                            <div className='text-left'>
                                <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
                                <input
                                    type="password"
                                    id="password"
                                    placeholder="Enter your password"
                                    {...register('password', {
                                        required: "Password is required",
                                        minLength: {
                                            value: 6,
                                            message: "Password must be at least 6 characters"
                                        }
                                    })}
                                    className='rounded-md'
                                    style={{ width: '100%', padding: '8px', fontSize: '14px' }}
                                />
                                {errors.password && <p style={{ color: 'red', fontSize: '12px' }}>{errors.password.message}</p>}
                            </div>

                            {/* Submit Button */}
                            <button
                                className='mt-4'
                                type="submit"
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    backgroundColor: '#4CAF50',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    fontSize: '16px',
                                    cursor: 'pointer'
                                }}
                            >
                                Register
                            </button>
                        </form>
                        <LoginWithGoogle></LoginWithGoogle>
                        <p className='text-center'>Already have an account? <Link className='text-blue-800 hover:font-bold' to="/login">Login</Link></p>
                    </div>
                    <div className='w-1/2 hidden lg:flex justify-center items-center'>
                        <Lottie className='w-[70%]' animationData={LottieDataRegister}></Lottie>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
