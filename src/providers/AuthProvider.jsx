import React, { createContext, useEffect, useState } from 'react';
import auth from '../firebase/firebase.init';
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';
import axios from 'axios';
const googleProvider = new GoogleAuthProvider();

export const AuthContext = createContext(null);


const AuthProvider = ({ children }) => {

    const googleProvider = new GoogleAuthProvider();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState(""); // State for search input
    const [category, setCategory] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [notificationCount, setNotificationCount] = useState(0);

    const createANewUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password)
    }


    // Function to increment the notification count
    const incrementNotification = () => {
        setNotificationCount((prevCount) => prevCount + 1);
    };


    const googleLogIn = () => {
        setLoading(true);
        return signInWithPopup(auth, googleProvider);
    }

    const logInAUser = (email, password) => {
        setLoading(true)
        return signInWithEmailAndPassword(auth, email, password)
    }

    const logOut = () => {
        // Swal.fire({
        //     title: 'Logged Out, Please Login',
        //     icon: 'info',
        //     timer: 1000,
        //     showConfirmButton: false,
        //     timerProgressBar: true,
        // });
        setLoading(true)
        return signOut(auth)
    }

    const updateUserProfile = (updatedData) => {
        return updateProfile(auth.currentUser, updatedData)
    }


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser)
            console.log("Current User", currentUser?.email);
            if (currentUser?.email) {
                const user = { email: currentUser.email }

                axios.post('http://localhost:5000/jwt', user, { withCredentials: true, })
                    .then(res => {
                        console.log("login", res.data)
                        setLoading(false);
                    })
            }
            else {
                axios.post('http://localhost:5000/logout', {}, { withCredentials: true, })
                    .then(res => {
                        console.log("logout", res.data);
                        setLoading(false);
                    })
            }
            setLoading(false);
        });
        return () => {
            unsubscribe();
        };
    }, []);


    const authInfo = {
        user,
        setUser,
        loading,
        notificationCount,
        setNotificationCount,
        createANewUser,
        logInAUser,
        logOut,
        googleLogIn,
        updateUserProfile,
        search, setSearch,
        category, setCategory,
        minPrice, setMinPrice,
        maxPrice, setMaxPrice,


    }


    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;