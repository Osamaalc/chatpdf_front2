// // src/components/common/Loader.jsx
// import React from 'react';
//
// const Loader = ({ size = 'medium', color = 'blue', className = '' }) => {
//     // Size variants
//     const sizeVariants = {
//         small: 'w-4 h-4 border-2',
//         medium: 'w-6 h-6 border-2',
//         large: 'w-8 h-8 border-3'
//     };
//
//     // Color variants
//     const colorVariants = {
//         blue: 'border-blue-600',
//         gray: 'border-gray-600',
//         green: 'border-green-600',
//         white: 'border-white'
//     };
//
//     // Generate final classes
//     const spinnerClasses = `
//     animate-spin rounded-full
//     ${sizeVariants[size]}
//     border-t-transparent
//     ${colorVariants[color]}
//     ${className}
//   `;
//
//     return (
//         <div className="flex items-center justify-center">
//             <div className={spinnerClasses} role="status" aria-label="Loading">
//                 <span className="sr-only">Loading...</span>
//             </div>
//         </div>
//     );
// };
//
// export default Loader;