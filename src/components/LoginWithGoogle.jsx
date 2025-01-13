import React, { useContext } from 'react';
import { AuthContext } from '../providers/AuthProvider';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const LoginWithGoogle = () => {


    const {user, loading, googleLogIn} = useContext(AuthContext);

    const navigate = useNavigate();

    const handleLoginGoogle = () => {

        googleLogIn()
            .then(res => {

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