import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from "@/components/ui/button";

export default function PaymentSuccess() {
  const router = useRouter();
  const { trxref } = router.query;
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState<null | boolean>(null);
  const [error, setError] = useState<string | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);

  useEffect(() => {
    if (trxref) {
      verifyPayment(trxref as string);
    }
    // eslint-disable-next-line
  }, [trxref]);

  const verifyPayment = async (reference: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/paystack/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference })
      });
      const data = await res.json();
      if (data.success) {
        setVerified(true);
        // Send order summary email (replace with real data as needed)
        fetch('/api/send-order-summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderSummary: 'Order details here', // TODO: Replace with actual order summary
            customerEmail: 'customer@example.com', // TODO: Replace with actual customer email
            customerPhone: '1234567890' // TODO: Replace with actual customer phone
          })
        })
        .then(async (res) => {
          const data = await res.json();
          if (!res.ok) {
            console.error('Order summary email failed:', data);
          } else {
            console.log('Order summary email sent:', data);
          }
        })
        .catch((err) => {
          console.error('Order summary email request error:', err);
        });
        // Redirect to homepage after verification
        router.replace('/');
      } else {
        setVerified(false);
        setError(data.message || 'Payment could not be verified.');
        setShowErrorModal(true);
      }
    } catch (err: any) {
      setError('An error occurred while verifying payment.');
      setShowErrorModal(true);
      setVerified(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        {/* Error Modal */}
        {showErrorModal && error && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
              <h3 className="text-lg font-semibold text-red-600 mb-2">Error</h3>
              <p className="text-gray-700 mb-4">{error}</p>
              <Button onClick={() => setShowErrorModal(false)} className="bg-red-600 hover:bg-red-700 text-white rounded-full px-6 py-2">Dismiss</Button>
            </div>
          </div>
        )}
        <div className="text-center">
          {loading ? (
            <div className="flex flex-col items-center">
              <svg className="animate-spin h-8 w-8 text-blue-600 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
              <p className="text-gray-600">Verifying your payment...</p>
            </div>
          ) : verified ? (
            <>
              <div className="mx-auto h-[120px] w-[120px] bg-green-100 rounded-full flex items-center justify-center">
                <svg className="h-20 w-20 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="mt-3 text-lg font-medium text-gray-900">
                Payment Verified!
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Your payment has been processed successfully. You will receive an email receipt shortly.
              </p>
            </>
          ) : (
            <>
              <div className="mx-auto h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="mt-3 text-lg font-medium text-gray-900">
                Payment Not Verified
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                {error || 'We could not verify your payment. Please contact support.'}
              </p>
            </>
          )}
        </div>
        <div className="mt-6">
          <Button
            onClick={() => router.push('/')}
            className="w-full bg-[#011B33] hover:bg-blue-600 text-white rounded-full py-4"
          >
            Return to Home
          </Button>
        </div>
      </div>
    </div>
  );
}

