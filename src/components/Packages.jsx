import React from 'react';
import SectionHeading from './SectionHeading';

function Packages() {
    const packages = [
        {
            name: 'Silver',
            price: 29.99,
            features: ['Basic Support', '10GB Storage', 'Monthly Reports'],
            bgColor: 'bg-gray-100',
            textColor: 'text-gray-700'
        },
        {
            name: 'Gold',
            price: 59.99,
            features: ['Priority Support', '50GB Storage', 'Weekly Reports'],
            bgColor: 'bg-yellow-100',
            textColor: 'text-yellow-700'
        },
        {
            name: 'Platinum',
            price: 99.99,
            features: ['24/7 Support', 'Unlimited Storage', 'Daily Reports'],
            bgColor: 'bg-blue-100',
            textColor: 'text-blue-700'
        }
    ];

    return (
        <div className="max-w-7xl mx-auto py-10 px-4">
            <SectionHeading title="Be Premium Member"></SectionHeading>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {packages.map((pkg) => (
                    <div
                        key={pkg.name}
                        className={`p-6 rounded-lg shadow-lg ${pkg.bgColor}`}
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
