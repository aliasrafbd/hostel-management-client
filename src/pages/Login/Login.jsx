import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Lottie from 'lottie-react';
import LottieDataLogin from '../../assets/lottie/login-lottie.json';
import { AuthContext } from '../../providers/AuthProvider';
import Swal from 'sweetalert2';
import LoginWithGoogle from '../../components/LoginWithGoogle';
import { easeOut, motion } from "framer-motion";

function Login() {
    // Initialize useForm hook to manage form state
    const { register, handleSubmit, formState: { errors } } = useForm();

    const navigate = useNavigate();

    const { user, setUser, logInAUser, loading, googleLogIn } = useContext(AuthContext);
    const [error, setError] = useState("");

    // Handle form submission
    const onSubmit = (loginData) => {
        console.log("Login Data:", loginData);

        logInAUser(loginData?.email, loginData?.password)
            .then((result) => {
                setUser(result?.user)

                Swal.fire({
                    title: 'Logging in...',
                    text: 'Please wait while we process your request.',
                    icon: 'info',
                    timer: 1000,
                    showConfirmButton: false,
                    timerProgressBar: true,
                });

                navigate("/");

            })
            .catch((err) => {
                setError({ ...error, login: err.code });
                Swal.fire({
                    title: 'Logging error',
                    text: 'Please put correct Email and Password.',
                    icon: 'info',
                    timer: 1000,
                    showConfirmButton: false,
                    timerProgressBar: true,
                });

            });
    }



    return (
        <div className='login-bg'>
            <div className='login-overlay'></div>
            <div className="login-form max-w-7xl mx-auto">

                <motion.h2
                    animate={
                        { x: [0, 200, -200] }
                    }
                    transition={
                        { duration: 8, ease: easeOut, repeat: Infinity }
                    }

                    className="mb-12 text-sm md:text-4xl font-bold">Welcome to <motion.span
                        animate={
                            { color: ['#33df33', '#55ffff', '#ff6133'], }
                        }
                        transition={
                            { duration: 1.5, repeat: Infinity }
                        }

                    >Poroshmoni Hostel</motion.span> </motion.h2>
                <h1 className='text-center font-bold text-3xl mb-6'>Login</h1>

                <hr className='my-4 max-w-sm mx-auto border-slate-400 border-2' />
                <div className='flex gap-6'>
                    <div className='flex-1 flex flex-col justify-center'>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            {/* Email Input */}
                            <div className='text-left my-2'>
                                <label htmlFor="email" >Email:</label>
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
                                Login
                            </button>
                        </form>
                        <LoginWithGoogle></LoginWithGoogle>
                        <p className='text-center'>Do not have a account? Please <Link className='text-blue-800 hover:font-bold' to="/register">Register</Link> </p>
                    </div>
                    <div className='w-1/2 flex justify-center items-center'>
                        <Lottie className='w-[70%]' animationData={LottieDataLogin}></Lottie>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;