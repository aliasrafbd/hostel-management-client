import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';

// Replace with your Stripe public key
const stripePromise = loadStripe('pk_test_51QjhL0FlTqzyqEh9x8FLYhq3XfaRSSaVjABkqfviZBYKGmdJ5XUq6gi0mvx7zrDLZjQC1fUiyKpZwzQUKwhyMEsS00NOFyuLzn');

const Checkout = () => {
    const { packageName } = useParams();
    const [clientSecret, setClientSecret] = useState('');
    const [paymentAmount, setPaymentAmount] = useState(0);

    useEffect(() => {
        // Fetch the PaymentIntent client secret when the page loads
        const fetchPaymentIntent = async () => {
            try {
                let amount;
                if (packageName === "silver") amount = 2000; // $20.00 USD
                if (packageName === "gold") amount = 3000; // $30.00 USD
                if (packageName === "platinum") amount = 4000; // $40.00 USD

                const response = await fetch('https://hostel-management-server-orcin.vercel.app/create-payment-intent', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ amount }),
                });
                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`);
                }
    
                const data = await response.json();
    
                console.log('Payment Intent Data:', data);
    
                if (data.success) {
                    setClientSecret(data.clientSecret); // Save clientSecret to state
                    setPaymentAmount(data.amount); // Save amount to state (if needed)
                } else {
                    console.error('Error in response:', data.error);
                }
            } catch (error) {
                console.error('Error fetching payment intent:', error.message);
            }
        };

        fetchPaymentIntent();
    }, [packageName]);

    const options = {
        clientSecret,
    };

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-2xl font-bold">Checkout</h1>
            <p>You selected the <strong>{packageName.charAt(0).toUpperCase() + packageName.slice(1).toLowerCase()}</strong> package.</p>
            {clientSecret ? (
                <Elements stripe={stripePromise} options={options}>
                    <CheckoutForm packageName={packageName} amount={paymentAmount} clientSecret={clientSecret} />
                </Elements>
            ) : (
                <p>Loading payment information...</p>
            )}
        </div>
    );
};

export default Checkout;
