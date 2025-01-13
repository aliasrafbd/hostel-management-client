import { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';
// import { motion } from 'motion/react';
// import logo from "../../src/assets/share-food-logo.png"
// import { easeOut } from 'motion';
// import { FaUser } from "react-icons/fa";

const Navbar = () => {

    const {user, logOut} = useContext(AuthContext);

    // const { pathname } = useLocation();

    // console.log(user);

    const Links = (<>

        <NavLink to="/"><button><li className='py-1 px-3 font-semibold'>Home</li></button></NavLink>
        {/* <NavLink to="/login"><button><li className='py-1 px-3 font-semibold'>Login</li></button></NavLink>
        <NavLink to="/register"><button><li className='py-1 px-3 font-semibold'>Register</li></button></NavLink> */}

        {
            !user && (<NavLink to="/login"><button><li className='py-1 px-3 font-semibold'>Login</li></button></NavLink>)
        }
        {
            !user && (<NavLink to="/register"><button><li className='py-1 px-3 font-semibold'>Register</li></button></NavLink>)
        }

    </>)

    return (
        <div className="">
            <div className="navbar mx-auto max-w-9xl lg:max-w-7xl px-4 lg:px-8 md:px-12 py-8" >
                <div className="navbar-start">
                    <div className="dropdown mr-6 md:mr-12 lg:mr-0">
                        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h8m-8 6h16" />
                            </svg>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                            {Links}
                        </ul>
                    </div>
                    <div className='flex flex-col justify-center items-center'>
                        {/* <motion.img
                            src={logo}

                            animate={
                                { x: [0, 50, 0] }
                            }
                            transition={
                                { duration: 8, repeat: Infinity }
                            }

                            className="max-w-lg w-24 h-24 mb-4 rounded-t-[45px]" />
                        <motion.h2
                            animate={
                                { x: [0, 50, 0] }
                            }
                            transition={
                                { duration: 8, ease: easeOut, repeat: Infinity }
                            }

                            className="mb-12 text-sm md:text-xl font-bold">Food for <motion.span
                                animate= {
                                    { color: ['#33df33', '#33ff66', '#ff6133'], }
                                }
                                transition={
                                    { duration: 1.5, repeat: Infinity }
                                }

                            >All</motion.span> </motion.h2> */}
                    </div>

                </div>
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1">
                        {Links}
                    </ul>
                </div>
                
                <div className="navbar-end">
                    <div className=" flex gap-4 justify-center items-center">
                        <div className="tooltip tooltip-bottom text-3xl">
                            {
                                !user ? "abcd" : <img referrerPolicy='no-referrer' className="md:h-16 md:w-16 h-12 w-12 rounded-full" src={user.photoURL} />
                            }
                        </div>
                        <div>
                            {
                                user ? <Link to="/"><button className="" onClick={logOut}>Log Out</button></Link> : <Link to="/login"><button className="">Login</button></Link>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;


{/* data-tip={user?.displayName} */}