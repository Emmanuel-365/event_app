import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner, Html5QrcodeScannerState } from 'html5-qrcode';
import { useAuth } from '../context/AuthContext';
import { validateTicket } from '../services/subscriptionService';
import { Link } from 'react-router-dom';

interface ValidatedTicketData {
    eventName: string;
    visitorName: string;
    ticketType: string;
    places: number;
}

type ValidationStatus = 'idle' | 'scanning' | 'success' | 'used' | 'invalid' | 'error';

const TicketScanner: React.FC = () => {
    const { user } = useAuth();
    const [scanResult, setScanResult] = useState<string | null>(null);
    const [status, setStatus] = useState<ValidationStatus>('idle');
    const [validatedData, setValidatedData] = useState<ValidatedTicketData | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>('');

    useEffect(() => {
        if (status !== 'scanning') return;

        const scanner = new Html5QrcodeScanner(
            'qr-reader',
            {
                fps: 10,
                qrbox: { width: 250, height: 250 },
            },
            /* verbose= */ false
        );

        const onScanSuccess = (decodedText: string) => {
            scanner.clear();
            setScanResult(decodedText);
            handleValidate(decodedText);
        };

        const onScanError = (error: any) => {
            // Ignore 'QR code not found' errors which happen continuously
            if (!/qr code not found/i.test(error)) {
                console.warn(`QR scan error: ${error}`);
            }
        };

        scanner.render(onScanSuccess, onScanError);

        return () => {
            // Cleanup scanner on component unmount or when status changes
            if (scanner && scanner.getState() === Html5QrcodeScannerState.SCANNING) {
                scanner.clear().catch(err => console.error("Failed to clear scanner", err));
            }
        };
    }, [status]);

    const handleValidate = async (ticketCode: string) => {
        try {
            const response = await validateTicket(ticketCode);
            if (response.status === 200) {
                const { event, visitorProfile, ticket, places } = response.data;
                setValidatedData({
                    eventName: event.title,
                    visitorName: `${visitorProfile.name} ${visitorProfile.surname}`,
                    ticketType: ticket.intitule,
                    places,
                });
                setStatus('success');
            }
        } catch (error: any) {
            const apiError = error.response?.data;
            if (error.response?.status === 409) { // 409 Conflict for already used
                setStatus('used');
                setErrorMessage(apiError?.message || 'This ticket has already been used.');
            } else if (error.response?.status === 404) { // 404 Not Found
                setStatus('invalid');
                setErrorMessage(apiError?.message || 'This ticket code is invalid.');
            } else {
                setStatus('error');
                setErrorMessage(apiError?.message || 'An unexpected error occurred.');
            }
        }
    };
    
    const resetScanner = () => {
        setScanResult(null);
        setStatus('idle');
        setValidatedData(null);
        setErrorMessage('');
    }

    if (!user || user.role !== 'ROLE_ORGANIZER') {
        return (
            <div className="text-center p-8">
                <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
                <p className="mt-2 text-neutral-600 dark:text-neutral-300">You must be logged in as an organizer to access this page.</p>
                <Link to="/login" className="mt-4 inline-block text-primary-600 hover:underline">Login</Link>
            </div>
        );
    }
    
    const StatusDisplay = () => {
        switch (status) {
            case 'success':
                return (
                    <div className="bg-green-100 dark:bg-green-900/30 border-l-4 border-green-500 text-green-800 dark:text-green-200 p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-extrabold mb-4">Ticket Validated!</h2>
                        <p><strong>Event:</strong> {validatedData?.eventName}</p>
                        <p><strong>Visitor:</strong> {validatedData?.visitorName}</p>
                        <p><strong>Ticket:</strong> {validatedData?.ticketType}</p>
                        <p><strong>Places:</strong> {validatedData?.places}</p>
                    </div>
                );
            case 'used':
            case 'invalid':
            case 'error':
                const color = status === 'used' ? 'yellow' : 'red';
                return (
                    <div className={`bg-${color}-100 dark:bg-${color}-900/30 border-l-4 border-${color}-500 text-${color}-800 dark:text-${color}-200 p-6 rounded-lg shadow-lg`}>
                        <h2 className="text-2xl font-extrabold mb-2">{status === 'used' ? 'Already Used' : 'Validation Failed'}</h2>
                        <p>{errorMessage}</p>
                    </div>
                );
            default:
                return null;
        }
    }


    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-3xl font-bold text-center mb-6 dark:text-white">Ticket Scanner</h1>
            
            {status === 'idle' && (
                <div className="text-center">
                    <button onClick={() => setStatus('scanning')} className="bg-primary-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-700 transition-colors">
                        Start Scanning
                    </button>
                </div>
            )}

            {status === 'scanning' && (
                <div>
                    <div id="qr-reader" className="w-full border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-lg overflow-hidden"></div>
                     <button onClick={() => setStatus('idle')} className="mt-4 w-full bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-bold py-2 px-4 rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors">
                        Cancel
                    </button>
                </div>
            )}
            
            {status !== 'idle' && status !== 'scanning' && (
                 <div className="mt-6 text-center">
                    <StatusDisplay />
                    <button onClick={resetScanner} className="mt-6 bg-primary-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-700 transition-colors">
                        Scan Next Ticket
                    </button>
                </div>
            )}
        </div>
    );
};

export default TicketScanner;
