import React, { useContext } from 'react';
import { AuthContext } from '../providers/AuthProvider';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import useAxiosPublic from '../hooks/useAxiosPublic';

const LoginWithGoogle = () => {


    const { user, loading, googleLogIn } = useContext(AuthContext);

    const axiosPublic = useAxiosPublic();

    const navigate = useNavigate();

    const handleLoginGoogle = () => {

        googleLogIn()
            .then(res => {
                console.log(res.user);
                const userInfo = {
                    name: res.user.displayName,
                    email: res.user.email,
                    badge: "Bronze",
                }

                axiosPublic.post('/users', userInfo)
                    .then(res => {
                        console.log(res.data);
                        navigate('/');
                    })


                        Swal.fire({
                            title: 'Logging in',
                            text: 'Please wait while we process your request.',
                            icon: 'info',
                            timer: 1000,
                            showConfirmButton: false,
                            timerProgressBar: true,
                        });

                        navigate("/");
                    })

            };


        return (
            <div>
                <button onClick={handleLoginGoogle} className='btn btn-error text-center block w-full my-4'>Login with GOOGLE</button>
            </div>
        );
    };

    export default LoginWithGoogle;