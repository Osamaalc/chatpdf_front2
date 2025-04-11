// // src/components/common/EmptyState.jsx
// import React from 'react';
//
// const EmptyState = ({
//                         title,
//                         description,
//                         icon,
//                         action = null,
//                         className = ''
//                     }) => {
//     return (
//         <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
//             {icon && (
//                 <div className="text-5xl mb-4 text-gray-400">
//                     {icon}
//                 </div>
//             )}
//
//             <h3 className="text-lg font-medium text-gray-900 mb-2">
//                 {title}
//             </h3>
//
//             {description && (
//                 <p className="text-sm text-gray-500 max-w-md mb-6">
//                     {description}
//                 </p>
//             )}
//
//             {action && (
//                 <div>
//                     {action}
//                 </div>
//             )}
//         </div>
//     );
// };
//
// export default EmptyState;