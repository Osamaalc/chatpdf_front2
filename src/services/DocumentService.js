// src/services/DocumentService.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://0.0.0.0:5000';

/**
 * Generates a random ID for API requests
 * @param {number} min - Minimum value (inclusive)
 * @param {number} max - Maximum value (inclusive)
 * @returns {number} Random integer ID
 */
const generateRandomId = (min = 100, max = 999) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Service for handling document-related API calls
 */
class DocumentService {
    constructor() {
        this.sessionId = null;
    }

    /**
     * Upload a document file to the server
     * @param {File} file - The file to upload
     * @returns {Promise} Response from the API
     */
    async uploadDocument(file) {
        const formData = new FormData();
        formData.append('file', file);

        // Generate a random ID for this session
        const sessionId = generateRandomId();

        try {
            console.log('Uploading file:', file.name, 'to:', `${API_BASE_URL}/api/v1/data/upload/${sessionId}`);

            const response = await axios.post(
                `${API_BASE_URL}/api/v1/data/upload/${sessionId}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            console.log('Upload response:', response.data);

            // Store the session ID for subsequent requests
            this.sessionId = sessionId;

            return response.data;
        } catch (error) {
            console.error('Error uploading document:', error.response || error);
            throw error;
        }
    }

    /**
     * Process the uploaded document
     * @param {Object} options - Processing options
     * @param {number} options.chunkSize - Size of chunks to split the document
     * @param {number} options.overlapSize - Size of overlap between chunks
     * @param {number} options.doRest - Whether to do the rest of the processing
     * @returns {Promise} Response from the API
     */
    async processDocument(options = { chunkSize: 500, overlapSize: 50, doRest: 1 }) {
        // Use the same session ID from the upload request
        const sessionId = this.sessionId || generateRandomId();

        try {
            console.log('Processing document with options:', options, 'using session ID:', sessionId);

            const response = await axios.post(
                `${API_BASE_URL}/api/v1/data/process/${sessionId}`,
                {
                    chunk_size: options.chunkSize,
                    overlap_size: options.overlapSize,
                    do_rest: options.doRest
                }
            );

            console.log('Process response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error processing document:', error.response || error);
            throw error;
        }
    }

    /**
     * Index the processed document
     * @param {Object} options - Indexing options
     * @param {number} options.doReset - Whether to reset the index
     * @returns {Promise} Response from the API
     */
    async indexDocument(options = { doReset: 1 }) {
        // Use the same session ID from previous requests
        const sessionId = this.sessionId || generateRandomId();

        try {
            console.log('Indexing document with options:', options, 'using session ID:', sessionId);

            const response = await axios.post(
                `${API_BASE_URL}/api/v1/nlp/index/push/${sessionId}`,
                {
                    do_reset: options.doReset
                }
            );

            console.log('Index response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error indexing document:', error.response || error);
            throw error;
        }
    }

    /**
     * Clear the current session ID
     */
    clearSession() {
        this.sessionId = null;
    }

    /**
     * Set a specific session ID (useful for resuming operations)
     * @param {number} id - The session ID to set
     */
    setSessionId(id) {
        this.sessionId = id;
    }

    /**
     * Get the current session ID
     * @returns {number|null} The current session ID or null if not set
     */
    getSessionId() {
        return this.sessionId;
    }
}

export default new DocumentService();