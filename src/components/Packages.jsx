import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import SectionHeading from './SectionHeading';

function Packages() {
    const navigate = useNavigate(); // Initialize navigate

    const packages = [
        {
            name: 'Silver',
            price: 20,
            features: ['Basic Support', '10GB Storage', 'Monthly Reports'],
            bgColor: 'bg-gray-100',
            textColor: 'text-gray-700'
        },
        {
            name: 'Gold',
            price: 30,
            features: ['Priority Support', '50GB Storage', 'Weekly Reports'],
            bgColor: 'bg-yellow-100',
            textColor: 'text-yellow-700'
        },
        {
            name: 'Platinum',
            price: 40,
            features: ['24/7 Support', 'Unlimited Storage', 'Daily Reports'],
            bgColor: 'bg-blue-100',
            textColor: 'text-blue-700'
        }
    ];

    // Function to handle navigation
    const handleRedirect = (packageName) => {
        navigate(`/checkout/${packageName.toLowerCase()}`);
    };

    return (
        <div className="max-w-7xl mx-auto py-10 px-4">
            <SectionHeading title="Be a Premium Member"></SectionHeading>
            <div className="grid grid-cols-1 md:grid-cols-2 md:mx-auto lg:grid-cols-3 gap-6">
                {packages.map((pkg) => (
                    <div
                        key={pkg.name}
                        className={`p-6 rounded-lg shadow-lg ${pkg.bgColor} cursor-pointer`}
                        onClick={() => handleRedirect(pkg.name)} // Navigate on card click
                    >
                        <h2 className={`text-2xl font-semibold ${pkg.textColor}`}>
                            {pkg.name} Package
                        </h2>
                        <p className="text-lg mt-2">
                            <span className="text-3xl font-bold">${pkg.price}</span>/month
                        </p>
                        <ul className="mt-4 space-y-2">
                            {pkg.features.map((feature, index) => (
                                <li key={index} className="flex items-center">
                                    <span className="w-4 h-4 bg-green-500 rounded-full mr-2"></span>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <button
                            className={`mt-6 px-4 py-2 w-full font-semibold rounded-lg ${
                                pkg.textColor
                            } border border-current hover:bg-opacity-10`}
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent card click from triggering
                                handleRedirect(pkg.name);
                            }}
                        >
                            Choose {pkg.name}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Packages;