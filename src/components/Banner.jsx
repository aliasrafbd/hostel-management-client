import React from "react";

const Banner = () => {

    return (
        <>

            <div
                className="relative bg-cover bg-fixed bg-center h-[150px] md:h-[600px]"
                style={{ backgroundImage: "url('../src/assets/slider-01.jpg')" }} // Add your image path
            >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/20"></div>

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
                    <h1 className="text-4xl font-bold mb-4">Effortless Hostel Management Starts Here</h1>
                    <p className="text-lg mb-6">
                        Simplify hostel operations, track residents, and manage payments—all in one place.
                    </p>
                    <div className="flex w-full max-w-md">
                        {/* Input Field */}
                        <input
                            type="text"
                            placeholder="Search for a hostel or resident ID..."
                            className="flex-grow h-12 p-3 rounded-l-lg border-none outline-none text-gray-700"
                        />

                        {/* Gradient Button */}
                        <button
                            className="h-12 px-6 text-white font-medium rounded-r-lg bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800"
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