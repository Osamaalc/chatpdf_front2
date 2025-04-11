// src/components/pdf/PDFUploader.jsx
import React, { useState, useRef } from 'react';
import { Upload, X, AlertCircle, FileText } from 'lucide-react';
import PropTypes from 'prop-types';
import '../../styles/PDFUploader.css';

const PDFUploader = ({
                         onUploadStart,
                         onUploadSuccess,
                         onUploadError,
                         allowedFileTypes = '.pdf,.doc,.docx,.txt',
                         maxFileSize = 25, // In MB
                         className,
                         buttonText = 'Upload Document',
                         loadingText = 'Uploading...',
                         disabled = false,
                         children
                     }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!disabled) {
            setIsDragging(true);
        }
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (disabled) return;

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            validateAndProcessFile(files[0]);
        }
    };

    const handleFileChange = (e) => {
        if (disabled) return;

        if (e.target.files && e.target.files.length > 0) {
            validateAndProcessFile(e.target.files[0]);
        }
    };

    const validateAndProcessFile = (file) => {
        setError(null);

        // Validate file type
        const fileTypeRegex = new RegExp(`(${allowedFileTypes.split(',').join('|')})$`, 'i');
        if (!fileTypeRegex.test(file.name)) {
            const error = `Invalid file type. Please upload one of these formats: ${allowedFileTypes}`;
            setError(error);
            if (onUploadError) onUploadError(new Error(error));
            return;
        }

        // Validate file size
        if (file.size > maxFileSize * 1024 * 1024) {
            const error = `File is too large. Maximum size is ${maxFileSize}MB.`;
            setError(error);
            if (onUploadError) onUploadError(new Error(error));
            return;
        }

        setSelectedFile(file);

        // Call onUploadStart
        if (onUploadStart) {
            onUploadStart(file);
        }

        // Call onUploadSuccess with the file
        if (onUploadSuccess) {
            onUploadSuccess(file);
        }
    };

    const resetFileInput = () => {
        setSelectedFile(null);
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const openFileDialog = () => {
        if (disabled) return;

        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const renderFilePreview = () => {
        if (!selectedFile) return null;

        return (
            <div className="uploader-file-preview">
                <div className="file-info">
                    <FileText size={20} />
                    <div>
                        <div className="file-name">{selectedFile.name}</div>
                        <div className="file-size">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</div>
                    </div>
                </div>
                <button
                    className="remove-file-btn"
                    onClick={resetFileInput}
                    type="button"
                    aria-label="Remove file"
                    disabled={disabled}
                >
                    <X size={18} />
                </button>
            </div>
        );
    };

    return (
        <div
            className={`pdf-uploader ${isDragging ? 'dragging' : ''} ${disabled ? 'disabled' : ''} ${className || ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                accept={allowedFileTypes}
                className="uploader-input"
                id="pdf-file-input"
                disabled={disabled}
            />

            {error && (
                <div className="uploader-error">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                </div>
            )}

            {selectedFile ? renderFilePreview() : (
                <div className="uploader-content" onClick={openFileDialog}>
                    {children || (
                        <>
                            <div className="uploader-icon">
                                <Upload size={28} />
                            </div>
                            <div className="uploader-text">
                                <span className="uploader-title">
                                    {disabled ? loadingText : buttonText}
                                </span>
                                <span className="uploader-description">
                                    Drag & drop your file or click to browse
                                </span>
                                <span className="uploader-file-types">
                                    Supported formats: {allowedFileTypes.replace(/\./g, '').toUpperCase()}
                                </span>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

PDFUploader.propTypes = {
    onUploadStart: PropTypes.func,
    onUploadSuccess: PropTypes.func,
    onUploadError: PropTypes.func,
    allowedFileTypes: PropTypes.string,
    maxFileSize: PropTypes.number,
    className: PropTypes.string,
    buttonText: PropTypes.string,
    loadingText: PropTypes.string,
    disabled: PropTypes.bool,
    children: PropTypes.node
};

export default PDFUploader;