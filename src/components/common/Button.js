// // src/components/common/Button.jsx
// import React from 'react';
//
// const Button = ({
//                     children,
//                     onClick,
//                     className = '',
//                     disabled = false,
//                     type = 'button',
//                     variant = 'primary',
//                     size = 'medium',
//                     icon = null
//                 }) => {
//     // Base classes
//     const baseClasses = 'font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
//
//     // Size classes
//     const sizeClasses = {
//         small: 'px-3 py-1.5 text-sm',
//         medium: 'px-4 py-2',
//         large: 'px-6 py-3 text-lg'
//     };
//
//     // Variant classes
//     const variantClasses = {
//         primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 disabled:bg-blue-300',
//         secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-800 focus:ring-gray-500 disabled:bg-gray-100 disabled:text-gray-400',
//         outline: 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 focus:ring-blue-500 disabled:text-gray-300'
//     };
//
//     const classes = `
//     ${baseClasses}
//     ${sizeClasses[size]}
//     ${variantClasses[variant]}
//     ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
//     ${className}
//   `;
//
//     return (
//         <button
//             type={type}
//             className={classes}
//             onClick={onClick}
//             disabled={disabled}
//         >
//             <div className="flex items-center justify-center">
//                 {icon && <span className="mr-2">{icon}</span>}
//                 {children}
//             </div>
//         </button>
//     );
// };
//
// export default Button;