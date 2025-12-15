import React, { useState } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { confirmPayment } from '../services/subscriptionService';

const PaymentSimulation: React.FC = () => {
    const { subscriptionId } = useParams<{ subscriptionId: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    const { amount } = location.state as { amount: number };

    const [isLoading, setIsLoading] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleConfirmPayment = async () => {
        if (!subscriptionId) return;
        setIsLoading(true);
        setErrorMessage('');

        try {
            await confirmPayment(Number(subscriptionId));
            setPaymentStatus('success');
        } catch (error: any) {
            setPaymentStatus('error');
            setErrorMessage(error.response?.data?.message || 'An unknown error occurred during payment confirmation.');
        } finally {
            setIsLoading(false);
        }
    };
    
    if(!subscriptionId || !amount) {
        return (
             <div className="max-w-md mx-auto text-center p-8">
                 <h1 className="text-2xl font-bold text-red-600">Error</h1>
                 <p className="mt-2">Missing payment information. Please try subscribing again.</p>
                 <button onClick={() => navigate('/')} className="mt-4 bg-primary-600 text-white font-bold py-2 px-4 rounded hover:bg-primary-700">Go to Homepage</button>
            </div>
        )
    }

    return (
        <div className="max-w-md mx-auto mt-10 text-center bg-white dark:bg-neutral-800 shadow-xl rounded-2xl p-8 border border-neutral-200 dark:border-neutral-700">
            {paymentStatus === 'idle' && (
                <>
                    <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Payment Simulation</h1>
                    <p className="text-neutral-600 dark:text-neutral-300 mt-4">This is a simulated payment screen. No real transaction will be made.</p>
                    
                    <div className="my-8">
                        <p className="text-lg text-neutral-700 dark:text-neutral-200">Total Amount:</p>
                        <p className="text-4xl font-extrabold text-primary-600 dark:text-primary-400">{amount.toLocaleString('fr-FR')} CFA</p>
                    </div>

                    <button 
                        onClick={handleConfirmPayment}
                        disabled={isLoading}
                        className="w-full bg-primary-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-700 transition-colors disabled:bg-primary-400"
                    >
                        {isLoading ? 'Processing...' : 'Confirm Mock Payment'}
                    </button>
                </>
            )}

            {paymentStatus === 'success' && (
                <div className="text-green-500">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h1 className="text-2xl font-bold mt-4">Payment Successful!</h1>
                    <p className="mt-2">Your ticket and QR code have been sent to your email.</p>
                    <Link to="/my-subscriptions" className="mt-6 inline-block bg-primary-600 text-white font-bold py-2 px-4 rounded hover:bg-primary-700">
                        View My Subscriptions
                    </Link>
                </div>
            )}

            {paymentStatus === 'error' && (
                <div className="text-red-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h1 className="text-2xl font-bold mt-4">Payment Failed</h1>
                    <p className="mt-2">{errorMessage}</p>
                     <button onClick={handleConfirmPayment} className="mt-6 bg-primary-600 text-white font-bold py-2 px-4 rounded hover:bg-primary-700">
                        Retry Payment
                    </button>
                </div>
            )}
        </div>
    );
};

export default PaymentSimulation;
