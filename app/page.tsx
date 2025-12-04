// app/page.tsx

import CouponForm from '../ui/CouponForm'; 
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] }); 

// Utility component for the ticket notch cutout (only used once now)
const Notch = ({ position }: { position: 'top' | 'bottom' }) => (
  <div
    className={`absolute w-8 h-6 bg-gray-300 rounded-b-full ${
      position === 'top' ? '-top-2' : '-bottom-2'
    }`}
  />
);

export default function CouponPage() {
  return (
    // Dark Grey Background
    <main className={`flex min-h-screen items-center justify-center bg-gray-300 p-4 ${inter.className}`}>
      
      {/* Outer Container */}
      <div className="relative w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden bg-white">
        
        {/* White Ticket Body */}
        <div className="relative z-10 p-10 text-center bg-white border-b-4 border-dashed border-gray-200">
          
          {/* Discount Tag Icon (Proper Icon for a Coupon) */}
          <div className="flex justify-center mb-6">
            <svg className="w-12 h-12 text-red-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M11.3 5.3a.9.9 0 0 0-1.2 0L5.3 9.8c-.3.3-.4.7-.3 1.1L7.7 18c.1.4.5.7.9.7h8.8c.4 0 .8-.3.9-.7l2.8-7.1c.1-.4 0-.8-.3-1.1l-4.8-4.5Z" clipRule="evenodd"/>
              <path fillRule="evenodd" d="M14 12.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Zm-4 0a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z" clipRule="evenodd"/>
            </svg>
          </div>
          
          <h2 className="text-5xl font-extrabold tracking-tight text-gray-900 mb-2">
            Exclusive Offers
          </h2>
          <p className="text-base text-gray-500 mb-6 font-medium">
            on your entire next purchase
          </p>
          
          {/* REMOVED the redundant notch component here */}
          <div className="flex justify-center">
            <Notch position="top" /> 
          </div>
        </div>
        
        {/* Orange Redemption Area (Ticket Bottom) */}
        <div className="bg-orange-50 p-8 rounded-b-2xl">
          
          <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6 text-center shadow-inner">
             <p className="text-base font-semibold text-gray-800 mb-1">Coupon Code Awaits!</p>
             <p className="text-sm text-gray-500">
               We'll generate your unique 4-digit code instantly.
             </p>
          </div>
          
          <CouponForm />
          
          <p className="text-xs text-gray-600 mt-6 text-center opacity-70">
            *Offer valid for new customers only. Expires in 48 hours.
          </p>
        </div>
      </div>
    </main>
  );
}