"use client";

import { useEffect, useState } from "react";

const OfflineFallback = () => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnlineStatus = () => setIsOnline(navigator.onLine);

    window.addEventListener("online", handleOnlineStatus);
    window.addEventListener("offline", handleOnlineStatus);

    return () => {
      window.removeEventListener("online", handleOnlineStatus);
      window.removeEventListener("offline", handleOnlineStatus);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Animated Illustration */}
        <div className="relative mx-auto w-64 h-64">
          <div className="absolute inset-0 bg-sky-200 rounded-full opacity-20 animate-pulse"></div>
          <div className="relative z-10 flex items-center justify-center">
            <svg
              className="w-48 h-48 text-sky-600 animate-bounce"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-800">
            {isOnline ? "Oops!" : "Connection Lost"}
          </h1>

          <p className="text-gray-600 text-lg">
            {isOnline ? (
              "There was an unexpected error. Please try again."
            ) : (
              <>
                {` It seems you're offline. `}
                <br />
                Please check your internet connection.
              </>
            )}
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-sky-600 to-blue-500 hover:from-sky-700 hover:to-blue-600 transition-all transform hover:scale-105 shadow-lg"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          {isOnline ? "Try Again" : "Retry Connection"}
        </button>

        {/* Additional Help Text */}
        {/* <p className="text-sm text-gray-500 mt-6">
          If the problem persists, contact our support team at 
          <a
            href="mailto:support@example.com"
            className="text-sky-600 hover:text-sky-700 ml-1"
          >
            support@example.com
          </a>
        </p> */}
      </div>
    </div>
  );
};

export default OfflineFallback;
// components/OfflineFallback.tsx
// "use client"

// import { useEffect, useState } from 'react';
// import './FallbackStyles.css';

// const OfflineFallback = () => {
//   const [isOnline, setIsOnline] = useState(true);

//   useEffect(() => {
//     const handleOnlineStatus = () => setIsOnline(navigator.onLine);

//     window.addEventListener('online', handleOnlineStatus);
//     window.addEventListener('offline', handleOnlineStatus);

//     return () => {
//       window.removeEventListener('online', handleOnlineStatus);
//       window.removeEventListener('offline', handleOnlineStatus);
//     };
//   }, []);

//   return (
//     <div className="fallback-container">
//       <div className="fallback-content">
//         <div className="illustration-container">
//           <div className="pulse-background"></div>
//           <div className="icon-wrapper">
//             <svg
//               className="bouncing-icon"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//               />
//             </svg>
//           </div>
//         </div>

//         <div className="text-content">
//           <h1>{isOnline ? 'Oops!' : 'Connection Lost'}</h1>
//           <p>
//             {isOnline ? (
//               'There was an unexpected error. Please try again.'
//             ) : (
//               <>
//                {` It seems you're offline. `}
//                 <br />
//                 Please check your internet connection.
//               </>
//             )}
//           </p>
//         </div>

//         <button
//           className="retry-button"
//           onClick={() => window.location.reload()}
//         >
//           <svg
//             className="button-icon"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
//             />
//           </svg>
//           {isOnline ? 'Try Again' : 'Retry Connection'}
//         </button>

//         <p className="support-text">
//           If the problem persists, contact our support team at
//           <a href="mailto:support@example.com" className="support-link">
//             support@example.com
//           </a>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default OfflineFallback;
