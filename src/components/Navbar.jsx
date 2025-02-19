import { useContext, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';
import { easeOut, motion } from "framer-motion";
import logo from "../../src/assets/poroshmoni-logo.png"
import { FaUser } from "react-icons/fa";
import { Menu, Sun, Moon } from "lucide-react";
import { IoIosNotificationsOutline } from "react-icons/io";
import { ThemeContext } from './ThemeProvider';


const Navbar = () => {

    const { user, logOut, notificationCount, setNotificationCount } = useContext(AuthContext);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const { theme, toggleTheme } = useContext(ThemeContext);
    

    const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
    const closeDropdown = () => setIsDropdownOpen(false);

    const incrementNotification = () => {

        setNotificationCount((prevCount) => prevCount + 1);
    };

    
    const Links = (<>

        <NavLink to="/"><button><li className='py-1 px-3 font-semibold'>Home</li></button></NavLink>
        <NavLink to="/meals"><button><li className='py-1 px-3 font-semibold'>Meals</li></button></NavLink>
        <NavLink to="/upcomingmeals"><button><li className='py-1 px-3 font-semibold'>Upcoming Meals</li></button></NavLink>
        <NavLink to="/contactus"><button><li className='py-1 px-3 font-semibold'>Contact Us</li></button></NavLink>

        {
            !user && (<NavLink to="/register"><button><li className='py-1 px-3 font-semibold'>Join Us</li></button></NavLink>)
        }

    </>)

    console.log("notification count from nav", notificationCount);

    return (
        <div className="bg-gray-100 sticky top-0 z-50">
            <div className="navbar mx-auto max-w-7xl px-4 lg:px-8 md:px-12">
                {/* Navbar Start */}
                <div className="navbar-start">
                    <div className="dropdown mr-6 md:mr-12 lg:mr-0">
                        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h8m-8 6h16"
                                />
                            </svg>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content text-black bg-white rounded-box z-[1] mt-3 w-52 p-2 shadow"
                        >
                            {Links}
                        </ul>
                    </div>
                    <div className="flex flex-col justify-center items-center">
                        <img className="max-w-lg w-24 h-24" src={logo} alt="Logo" />
                    </div>
                </div>

                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1">{Links}</ul>
                </div>
                <div className='relative ml-20 md:ml-80 mt-1 md:mt-2 lg:ml-0 text-xl'>
                    <button
                        className='relative focus:outline-none'
                    ><IoIosNotificationsOutline />
                    </button>
                    {/* Badge */}
                    {notificationCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-1 py-[2px] rounded-full">
                            {notificationCount}
                        </span>
                    )}
                </div>

                {/* Navbar End */}
                <div className="navbar-end">

                    <div className='flex items-center justify-center'>
                        <button onClick={toggleTheme} className="p-2">
                            {theme === "dark" ? <Sun size={24} /> : <Moon size={24} />} {/* Theme Toggle */}
                        </button>
                    </div>

                    <div className="flex gap-4 justify-center items-center">

                        {user ? (
                            <div className="relative">
                                <img
                                    referrerPolicy="no-referrer"
                                    className="md:h-16 md:w-16 h-12 w-12 rounded-full cursor-pointer"
                                    src={user.photoURL}
                                    alt="Profile"
                                    onClick={toggleDropdown}
                                />
                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                                        <div className="p-4 text-gray-800 border-b border-gray-200">
                                            <p className="font-semibold">{user.displayName}</p>
                                        </div>
                                        <ul className="text-gray-700">
                                            <li>
                                                <Link
                                                    to="/dashboard"
                                                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                                    onClick={closeDropdown}
                                                >
                                                    Dashboard
                                                </Link>
                                            </li>
                                            <li>
                                                <button
                                                    onClick={() => {
                                                        closeDropdown();
                                                        logOut();
                                                    }}
                                                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                                >
                                                    Logout
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex justify-center items-center gap-2 tooltip tooltip-bottom text-xl">
                                <FaUser />
                                <Link to="/login">
                                    <button className="text-md font-bold">Login</button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;