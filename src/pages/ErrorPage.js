// // src/pages/ErrorPage.jsx
// import React from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import Button from '../components/common/Button';
//
// const ErrorPage = () => {
//     const location = useLocation();
//     const errorMessage = location.state?.message || 'Page not found';
//     const errorCode = location.state?.code || 404;
//
//     return (
//         <div className="min-h-screen flex items-center justify-center bg-gray-50">
//             <div className="text-center max-w-md p-8">
//                 <div className="text-6xl font-bold text-red-500 mb-6">
//                     {errorCode}
//                 </div>
//
//                 <h1 className="text-2xl font-bold mb-4">
//                     Oops! Something went wrong
//                 </h1>
//
//                 <p className="text-gray-600 mb-8">
//                     {errorMessage}
//                 </p>
//
//                 <Link to="/">
//                     <Button size="large">
//                         Return to Home
//                     </Button>
//                 </Link>
//             </div>
//         </div>
//     );
// };
//
// export default ErrorPage;