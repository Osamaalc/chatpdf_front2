// // src/hooks/usePDF.js
// import { useState, useCallback } from 'react';
// import { pdfService } from '../services/pdfService';
// import { useLocalStorage } from './useLocalStorage';
//
// export const usePDF = () => {
//     const [isUploading, setIsUploading] = useState(false);
//     const [currentPDF, setCurrentPDF] = useState(null);
//     const [error, setError] = useState(null);
//     const [recentPDFs, setRecentPDFs] = useLocalStorage('recent_pdfs', []);
//
//     /**
//      * Upload a PDF file to the server
//      * @param {FormData} formData - Form data containing the PDF file
//      // * @returns {Promise<Object>} - Response with chat ID and success status
//      */
//     const uploadPDF = useCallback(async (formData) => {
//         setIsUploading(true);
//         setError(null);
//
//         try {
//             const response = await pdfService.uploadPDF(formData);
//
//             if (response && response.success) {
//                 // Store basic info about the PDF in local storage for recent history
//                 const newPDF = {
//                     id: response.pdfId,
//                     chatId: response.chatId,
//                     name: formData.get('pdf').name,
//                     size: formData.get('pdf').size,
//                     timestamp: new Date().toISOString()
//                 };
//
//                 // Update current PDF
//                 setCurrentPDF(newPDF);
//
//                 // Add to recent PDFs
//                 setRecentPDFs(prev => {
//                     // Remove duplicates if same PDF is uploaded again
//                     const filtered = prev.filter(pdf => pdf.id !== newPDF.id);
//                     // Add to beginning of array, limit to 10 most recent
//                     return [newPDF, ...filtered].slice(0, 10);
//                 });
//             }
//
//             return response;
//         } catch (err) {
//             setError(err.message || 'Failed to upload PDF');
//             throw err;
//         } finally {
//             setIsUploading(false);
//         }
//     }, [setRecentPDFs]);
//
//     /**
//      * Get information about a specific PDF
//      * @param {string} pdfId - ID of the PDF
//      */
//     const getPDFInfo = useCallback(async (pdfId) => {
//         setError(null);
//
//         try {
//             const response = await pdfService.getPDFInfo(pdfId);
//             setCurrentPDF(response);
//             return response;
//         } catch (err) {
//             setError(err.message || 'Failed to fetch PDF information');
//             throw err;
//         }
//     }, []);
//
//     /**
//      * Delete a PDF from the server
//      * @param {string} pdfId - ID of the PDF to delete
//      */
//     const deletePDF = useCallback(async (pdfId) => {
//         setError(null);
//
//         try {
//             await pdfService.deletePDF(pdfId);
//
//             // Remove from recent PDFs
//             setRecentPDFs(prev => prev.filter(pdf => pdf.id !== pdfId));
//
//             // Clear current PDF if it was the one deleted
//             if (currentPDF && currentPDF.id === pdfId) {
//                 setCurrentPDF(null);
//             }
//
//             return { success: true };
//         } catch (err) {
//             setError(err.message || 'Failed to delete PDF');
//             throw err;
//         }
//     }, [currentPDF, setRecentPDFs]);
//
//     return {
//         isUploading,
//         currentPDF,
//         recentPDFs,
//         error,
//         uploadPDF,
//         getPDFInfo,
//         deletePDF
//     };
// };