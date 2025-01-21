import React from 'react';
import { useParams } from 'react-router-dom';

const Checkout = () => {
    const { packageName } = useParams();

    console.log(packageName);



    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-2xl font-bold">Checkout</h1>
            <p>You selected the <strong>{packageName.charAt(0).toUpperCase() + packageName.slice(1).toLowerCase()}</strong> package.</p>
            {/* Add your checkout form or details here */}
        </div>
    );
};

export default Checkout;
