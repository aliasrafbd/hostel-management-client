import React from "react";
import usePremiumMember from "../hooks/usePremiumMember";
import Loading from "./Loading";

const Banner = ({ search, setSearch }) => {

    const { data: isPremiumMember, isLoading } = usePremiumMember();

    if (isLoading) {
        return <Loading></Loading>
    }

    console.log(isPremiumMember);

    return (
        <>
            <div className="banner-bg w-full h-[150px] md:h-[600px]">
                
                <div className='banner-bg-overlay'></div>
                
                <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
                    <h1 className="text-3xl md:text-5xl text-white font-extrabold mb-4">PoroshMoni Hostel, Chattogram</h1>
                    <p className="text-md md:text-lg mb-6">
                        Simplify hostel operations, track residents, and manage payments— all in one place.
                    </p>
                    <div className="flex w-full max-w-md join">
                        {/* Input Field */}
                        <input
                            type="text"
                            placeholder="Search meals..."
                            className="input input-bordered text-black w-full max-w-2xl mb-2 join-item rounded-r-full"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value); 
                            }}
                        />

                        
                        <button
                            className="h-12 px-12 text-sm text-white font-medium bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 btn join-item rounded-r-full"
                        >
                            Find Now
                        </button>
                    </div>
                </div>
            </div>

        </>
    );
};

export default Banner;