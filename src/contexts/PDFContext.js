// src/contexts/PDFContext.jsx
import React, { createContext, useState, useContext } from 'react';
import { uploadPDF, getPDFList, getPDFDetails, deletePDF } from '../services/pdfService';

const PDFContext = createContext();

export const usePDF = () => useContext(PDFContext);

export const PDFProvider = ({ children }) => {
    const [pdfs, setPdfs] = useState([]);
    const [currentPDF, setCurrentPDF] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Load all PDFs
    const loadPDFs = async () => {
        try {
            setLoading(true);
            const response = await getPDFList();
            setPdfs(response);
            setError(null);
        } catch (err) {
            console.error('Error loading PDFs:', err);
            setError('Failed to load PDFs. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Load a specific PDF
    const loadPDF = async (pdfId) => {
        try {
            setLoading(true);
            const response = await getPDFDetails(pdfId);
            setCurrentPDF(response);
            setError(null);
            return response;
        } catch (err) {
            console.error(`Error loading PDF ${pdfId}:`, err);
            setError('Failed to load PDF. Please try again.');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Upload a new PDF
    const upload = async (file) => {
        try {
            setLoading(true);
            const response = await uploadPDF(file);

            // Add the new PDF to the list
            setPdfs(prev => [response, ...prev]);

            setCurrentPDF(response);
            setError(null);
            return response;
        } catch (err) {
            console.error('Error uploading PDF:', err);
            setError('Failed to upload PDF. Please try again.');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Delete a PDF
    const removePDF = async (pdfId) => {
        try {
            setLoading(true);
            await deletePDF(pdfId);

            // Remove the PDF from the list
            setPdfs(prev => prev.filter(pdf => pdf.id !== pdfId));

            // Clear current PDF if it was the one deleted
            if (currentPDF && currentPDF.id === pdfId) {
                setCurrentPDF(null);
            }

            setError(null);
        } catch (err) {
            console.error(`Error deleting PDF ${pdfId}:`, err);
            setError('Failed to delete PDF. Please try again.');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const value = {
        pdfs,
        currentPDF,
        loading,
        error,
        loadPDFs,
        loadPDF,
        upload,
        removePDF
    };

    return (
        <PDFContext.Provider value={value}>
            {children}
        </PDFContext.Provider>
    );
};

export default PDFContext;