// // src/components/common/Notification.jsx
// import React, { useState, useEffect } from 'react';
//
// const Notification = ({
//                           type = 'info',
//                           message,
//                           duration = 5000,
//                           onClose
//                       }) => {
//     const [isVisible, setIsVisible] = useState(true);
//
//     useEffect(() => {
//         if (duration > 0) {
//             const timer = setTimeout(() => {
//                 setIsVisible(false);
//                 if (onClose) setTimeout(onClose, 300); // Wait for fade out animation
//             }, duration);
//
//             return () => clearTimeout(timer);
//         }
//     }, [duration, onClose]);
//
//     const handleClose = () => {
//         setIsVisible(false);
//         if (onClose) setTimeout(onClose, 300); // Wait for fade out animation
//     };
//
//     // Define styles based on notification type
//     const getTypeStyles = () => {
//         switch (type) {
//             case 'success':
//                 return 'bg-green-50 border-green-500 text-green-800';
//             case 'error':
//                 return 'bg-red-50 border-red-500 text-red-800';
//             case 'warning':
//                 return 'bg-yellow-50 border-yellow-500 text-yellow-800';
//             case 'info':
//             default:
//                 return 'bg-blue-50 border-blue-500 text-blue-800';
//         }
//     };
//
//     const getIcon = () => {
//         switch (type) {
//             case 'success':
//                 return '✓';
//             case 'error':
//                 return '✕';
//             case 'warning':
//                 return '⚠';
//             case 'info':
//             default:
//                 return 'ℹ';
//         }
//     };
//
//     return (
//         <div
//             className={`
//         notification border-l-4 p-4 my-4 rounded-md shadow-sm
//         ${getTypeStyles()}
//         ${isVisible ? 'opacity-100' : 'opacity-0'}
//         transition-opacity duration-300
//       `}
//             role="alert"
//         >
//             <div className="flex items-start">
//                 <div className="flex-shrink-0 mr-3">
//                     <span className="text-lg font-bold">{getIcon()}</span>
//                 </div>
//                 <div className="flex-1">
//                     <p className="text-sm">{message}</p>
//                 </div>
//                 <button
//                     onClick={handleClose}
//                     className="text-gray-400 hover:text-gray-600"
//                     aria-label="Close"
//                 >
//                     ✕
//                 </button>
//             </div>
//         </div>
//     );
// };
//
// export default Notification;