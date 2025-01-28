import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import useAdmin from '../hooks/useAdmin';

const DashBoard = () => {


    // TODO: get isAdmin value from the Database;
    const [isAdmin] = useAdmin();

    return (
        <div className='flex mx-auto gap-8'>
            {/* Dashboard SideBar */}
            <div className='w-28 md:w-64 min-h-screen bg-orange-600'>
                <ul className='menu p-4 space-y-2'>
                    {
                        isAdmin ?
                            <>
                                {/* Admin Dashboard  */}
                                <li><NavLink to="manageusers">Manage Users</NavLink></li>
                                <li><NavLink to="adminprofile">Admin Profile</NavLink></li>
                                <li><NavLink to="addmeal">Add Meal</NavLink></li>
                                <li><NavLink to="allmeals">All Meals</NavLink></li>
                                <li><NavLink to="allreviews">All Reviews</NavLink></li>
                                <li><NavLink to="servemeals">Serve Meals</NavLink></li>
                                <li><NavLink to="upcomingmeals">Upcoming Meals</NavLink></li>
                            </>
                            :
                            <>
                                {/* User Dashboard  */}
                                <li><NavLink to="myprofile">My Profile</NavLink></li>
                                <li><NavLink to="requestedmeals">Requested Meals</NavLink></li>
                                <li><NavLink to="myreviews">My Reviews</NavLink></li>
                                <li><NavLink to="paymenthistory">Payment History</NavLink></li>

                                <hr className='my-6' />
                            </>
                    }
                </ul>

                {/* Home  */}
                <button className='btn btn-secondary text-md m-4'><NavLink to="/">Home</NavLink></button>
            </div>

            {/* Dashboard Content  */}
            <div className='flex-1'>
                <Outlet></Outlet>
            </div>
        </div>
    );
};

export default DashBoard;