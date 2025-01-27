import React, { useState, useEffect, useContext } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { AuthContext } from '../providers/AuthProvider';
import useAxiosSecure from '../hooks/useAxiosSecure';
import Swal from 'sweetalert2';

const CheckoutForm = ({ packageName, amount, clientSecret }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [processing, setProcessing] = useState(false);

    const axiosSecure = useAxiosSecure();

    const { user } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        console.log(amount);

        setProcessing(true);

        const cardElement = elements.getElement(CardElement);

        try {
            // Confirm the payment using the client secret
            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                },
            });

            if (error) {
                setError(error.message);
                setProcessing(false);
                return;
            }

            if (paymentIntent.status === 'succeeded') {
                setPaymentSuccess(true);

                Swal.fire({
                    position: "top",
                    icon: "success",
                    title: `Thank you for the payment.`,
                    showConfirmButton: false,
                    timer: 1500
                })

                const paymentData = {
                    amount: amount / 100,
                    userEmail: user?.email,
                    paymentTime: new Date().toLocaleString(),
                    currency: "usd",
                    packageName: packageName,
                }

                // const {userEmail, packageName} = paymentData;

                // TODO: save this payment data to packagepaymentdata collection,
                // change user status: bronze to purchased package name

                const paymentDataRes = await axiosSecure.post('/package-payment-data', paymentData)
                // show success message 
                if (paymentDataRes.data.insertedId) {
                    console.log("success");
                }

                const updatedBadgeRes = await axiosSecure.patch('/update-badge', paymentData)
                // show success message 
                if (updatedBadgeRes.data.modifiedCount>0) {
                    console.log("success");
                }




            } else {
                setError('Payment failed. Please try again.');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-4 border rounded">
                <CardElement className="outline-none" />
            </div>
            {error && <p className="text-red-600">{error}</p>}
            <button
                type="submit"
                disabled={!stripe || !clientSecret}
                className="w-full btn btn-primary"
            >
                {processing ? 'Processing...' : 'Pay Now'}
            </button>
        </form>
    );
};

export default CheckoutForm;