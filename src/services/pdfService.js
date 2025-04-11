// src/services/pdfService.js
import api from './api';

/**
 * Upload a PDF file to the server
 * @param {File} file - The PDF file to upload
 * @returns {Promise<Object>} - The response from the server
 */
export const uploadPDF = async (file) => {
    try {
        // Create a FormData object to send the file
        const formData = new FormData();
        formData.append('file', file);

        // Configure the request with the appropriate headers
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        };

        // Make the API call to upload the file
        const response = await api.post('/upload', formData, config);

        return response.data;
    } catch (error) {
        console.error('Error uploading PDF:', error);
        throw new Error(error.response?.data?.message || 'Failed to upload PDF. Please try again.');
    }
};

/**
 * Get the list of all PDFs uploaded by the user
 * @returns {Promise<Array>} - List of PDF documents
 */
export const getPDFList = async () => {
    try {
        const response = await api.get('/pdfs');
        return response.data;
    } catch (error) {
        console.error('Error fetching PDF list:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch PDF list. Please try again.');
    }
};

/**
 * Get details of a specific PDF document
 * @param {string} pdfId - The ID of the PDF document
 * @returns {Promise<Object>} - PDF document details
 */
export const getPDFDetails = async (pdfId) => {
    try {
        const response = await api.get(`/pdfs/${pdfId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching PDF details for ID ${pdfId}:`, error);
        throw new Error(error.response?.data?.message || 'Failed to fetch PDF details. Please try again.');
    }
};

/**
 * Delete a PDF document from the server
 * @param {string} pdfId - The ID of the PDF document to delete
 * @returns {Promise<Object>} - The response from the server
 */
export const deletePDF = async (pdfId) => {
    try {
        const response = await api.delete(`/pdfs/${pdfId}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting PDF with ID ${pdfId}:`, error);
        throw new Error(error.response?.data?.message || 'Failed to delete PDF. Please try again.');
    }
};