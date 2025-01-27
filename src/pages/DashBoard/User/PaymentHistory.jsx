import React, { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { AuthContext } from '../../../providers/AuthProvider';

// Fetch payments by email
const fetchPaymentsByEmail = async (email) => {
  const response = await axios.get(`https://hostel-management-server-orcin.vercel.app/payments/${email}`, { withCredentials: true });
  return response.data.data; // Access the "data" key in the response
};

const PaymentHistory = () => {
  const { user } = useContext(AuthContext);
  const userEmail = user?.email;

  // Fetch payments using useQuery
  const { data: payments, isLoading, error } = useQuery({
    queryKey: ['payments', userEmail],
    queryFn: () => fetchPaymentsByEmail(userEmail),
    enabled: !!userEmail, // Only run if email is present
  });

  if (isLoading) {
    return <div className="text-center text-lg font-semibold">Loading your payment history...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 font-semibold">Error: {error.message}</div>;
  }

  if (!payments || payments.length === 0) {
    return (
      <div className="mt-12 mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">No Payment History Found</h2>
        <p className="text-gray-600">
          You haven't made any payments yet. Explore our services and make your first payment!
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-center mb-6">Payment History</h2>
      <table className="table-auto w-full text-left border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border border-gray-300">#</th>
            <th className="px-4 py-2 border border-gray-300">Package</th>
            <th className="px-4 py-2 border border-gray-300">Amount</th>
            <th className="px-4 py-2 border border-gray-300">Currency</th>
            <th className="px-4 py-2 border border-gray-300">Payment Time</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment, index) => (
            <tr
              key={payment._id}
              className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100'}
            >
              <td className="px-4 py-2 border border-gray-300">{index + 1}</td>
              <td className="px-4 py-2 border border-gray-300">{payment.packageName}</td>
              <td className="px-4 py-2 border border-gray-300">${payment.amount}</td>
              <td className="px-4 py-2 border border-gray-300">{payment.currency}</td>
              <td className="px-4 py-2 border border-gray-300">
                {new Date(payment.paymentTime).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentHistory;
