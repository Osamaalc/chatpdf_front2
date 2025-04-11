// import React, { useState, useEffect, useContext, useRef } from 'react';
// import { motion } from 'framer-motion';
// import { useNavigate } from 'react-router-dom';
// import '../styles/HomePage.css';
//
// import {
//     FileText, Search, Brain, MessageSquare, Check,
//     AlertCircle, Loader, ArrowRight, Shield,
//     Upload, Zap, Star, Cpu, Key, Rocket
// } from 'lucide-react';
//
// // استيراد سياق الثيم
// import { ThemeContext } from '../contexts/ThemeContext';
//
// // استيراد مكونات ووظائف رفع الملفات
// import PDFUploader from '../components/pdf/PDFUploader';
// import DocumentService from '../services/DocumentService';
// import { formatFileSize, getFileExtension } from '../utils/fileUtils';
//
// const EnhancedHomePage = () => {
//     const [uploadState, setUploadState] = useState({
//         uploading: false,
//         processing: false,
//         indexing: false,
//         error: null,
//         success: false,
//         fileId: null,
//         processingStats: { insertedRecords: 0 },
//         indexingStats: { insertedItemsCount: 0 },
//         fileName: "",
//         fileSize: 0
//     });
//
//     const { darkMode } = useContext(ThemeContext);
//     const navigate = useNavigate();
//     const [isHovering, setIsHovering] = useState(false);
//     const [documentType, setDocumentType] = useState("pdf");
//     const uploaderRef = useRef(null);
//
//     // وظيفة التعامل مع بدء التحميل
//     const handleUploadStart = (file) => {
//         setUploadState({
//             ...uploadState,
//             uploading: true,
//             success: false,
//             error: null,
//             fileName: file.name,
//             fileSize: file.size,
//             documentType: getFileExtension(file.name).toLowerCase()
//         });
//
//         // تحديث نوع المستند المعروض
//         setDocumentType(getFileExtension(file.name).toLowerCase());
//
//         // بدء عملية رفع الملف
//         uploadDocument(file);
//     };
//
//     // وظيفة التعامل مع خطأ التحميل
//     const handleUploadError = (error) => {
//         setUploadState({
//             ...uploadState,
//             uploading: false,
//             processing: false,
//             indexing: false,
//             error: error.message || "An unknown error occurred during upload."
//         });
//     };
//
//     // وظيفة رفع الملف إلى الخادم
//     const uploadDocument = async (file) => {
//         try {
//             // رفع الملف
//             const uploadResponse = await DocumentService.uploadDocument(file);
//
//             // تحديث حالة التحميل
//             setUploadState(prev => ({
//                 ...prev,
//                 uploading: false,
//                 processing: true,
//                 fileId: DocumentService.getSessionId()
//             }));
//
//             // بدء معالجة الملف
//             processDocument();
//         } catch (error) {
//             console.error("Upload error:", error);
//             handleUploadError(error);
//         }
//     };
//
//     // وظيفة معالجة الملف
//     const processDocument = async () => {
//         try {
//             // معالجة الملف
//             const processResponse = await DocumentService.processDocument();
//
//             // تحديث حالة المعالجة
//             setUploadState(prev => ({
//                 ...prev,
//                 processing: false,
//                 indexing: true,
//                 processingStats: {
//                     insertedRecords: processResponse.inserted_records || 0
//                 }
//             }));
//
//             // بدء فهرسة الملف
//             indexDocument();
//         } catch (error) {
//             console.error("Processing error:", error);
//             setUploadState(prev => ({
//                 ...prev,
//                 processing: false,
//                 error: error.message || "An error occurred during document processing."
//             }));
//         }
//     };
//
//     // وظيفة فهرسة الملف
//     const indexDocument = async () => {
//         try {
//             // فهرسة الملف
//             const indexResponse = await DocumentService.indexDocument();
//
//             // تحديث حالة الفهرسة
//             setUploadState(prev => ({
//                 ...prev,
//                 indexing: false,
//                 success: true,
//                 indexingStats: {
//                     insertedItemsCount: indexResponse.inserted_items_count || 0
//                 }
//             }));
//         } catch (error) {
//             console.error("Indexing error:", error);
//             setUploadState(prev => ({
//                 ...prev,
//                 indexing: false,
//                 error: error.message || "An error occurred during document indexing."
//             }));
//         }
//     };
//
//     // محاكاة رفع الملف للأغراض التجريبية (سيتم استخدامها إذا لم تكن هناك واجهة برمجة تطبيقات حقيقية)
//     const simulateUpload = (file) => {
//         // تحديث حالة التحميل
//         setUploadState({
//             ...uploadState,
//             uploading: true,
//             success: false,
//             error: null,
//             fileName: file ? file.name : "example-document.pdf",
//             fileSize: file ? file.size : 1024 * 1024 * 2.5,
//         });
//
//         // محاكاة التحميل
//         setTimeout(() => {
//             setUploadState(prev => ({
//                 ...prev,
//                 uploading: false,
//                 processing: true,
//                 fileId: Math.floor(Math.random() * 1000).toString()
//             }));
//
//             // محاكاة المعالجة
//             setTimeout(() => {
//                 setUploadState(prev => ({
//                     ...prev,
//                     processing: false,
//                     indexing: true,
//                     processingStats: { insertedRecords: 256 }
//                 }));
//
//                 // محاكاة الفهرسة
//                 setTimeout(() => {
//                     setUploadState(prev => ({
//                         ...prev,
//                         indexing: false,
//                         success: true,
//                         indexingStats: { insertedItemsCount: 128 }
//                     }));
//                 }, 2000);
//             }, 2000);
//         }, 2000);
//     };
//
//     // تناوب أنواع المستندات للعرض عندما لا يوجد ملف محدد
//     useEffect(() => {
//         if (!uploadState.fileName) {
//             const types = ["pdf", "docx", "txt", "rtf"];
//             const interval = setInterval(() => {
//                 setDocumentType(types[Math.floor(Math.random() * types.length)]);
//             }, 3000);
//             return () => clearInterval(interval);
//         }
//     }, [uploadState.fileName]);
//
//     // عرض حالة التحميل
//     const renderUploadStatus = () => {
//         if (uploadState.error) {
//             return (
//                 <motion.div
//                     className="upload-error"
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.5 }}
//                 >
//                     <AlertCircle className="status-icon error-icon" />
//                     <div>
//                         <h4>Error</h4>
//                         <p>{uploadState.error || "An unknown error occurred"}</p>
//                     </div>
//                 </motion.div>
//             );
//         }
//
//         if (uploadState.success) {
//             return (
//                 <motion.div
//                     className="upload-success"
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.5 }}
//                 >
//                     <Check className="status-icon success-icon" />
//                     <div>
//                         <h4>Success!</h4>
//                         <p>Your document has been uploaded, processed, and indexed successfully.</p>
//                         <div className="upload-stats">
//                             <motion.div
//                                 className="stat-item"
//                                 initial={{ scale: 0.8, opacity: 0 }}
//                                 animate={{ scale: 1, opacity: 1 }}
//                                 transition={{ delay: 0.1 }}
//                             >
//                                 <span>Processed Records</span>
//                                 <strong>{uploadState.processingStats?.insertedRecords || 0}</strong>
//                             </motion.div>
//                             <motion.div
//                                 className="stat-item"
//                                 initial={{ scale: 0.8, opacity: 0 }}
//                                 animate={{ scale: 1, opacity: 1 }}
//                                 transition={{ delay: 0.2 }}
//                             >
//                                 <span>Indexed Items</span>
//                                 <strong>{uploadState.indexingStats?.insertedItemsCount || 0}</strong>
//                             </motion.div>
//                             <motion.div
//                                 className="stat-item"
//                                 initial={{ scale: 0.8, opacity: 0 }}
//                                 animate={{ scale: 1, opacity: 1 }}
//                                 transition={{ delay: 0.3 }}
//                             >
//                                 <span>File Size</span>
//                                 <strong>{formatFileSize(uploadState.fileSize)}</strong>
//                             </motion.div>
//                         </div>
//                         <motion.button
//                             className="chat-now-button"
//                             whileHover={{ scale: 1.05 }}
//                             whileTap={{ scale: 0.95 }}
//                             onClick={() => navigate('/chat')}
//                         >
//                             Start Conversation
//                             <ArrowRight size={18} />
//                         </motion.button>
//                     </div>
//                 </motion.div>
//             );
//         }
//
//         if (uploadState.uploading || uploadState.processing || uploadState.indexing) {
//             let title = "Uploading...";
//             let description = `Uploading ${uploadState.fileName} (${formatFileSize(uploadState.fileSize)})`;
//             let details = null;
//
//             if (uploadState.processing) {
//                 title = "Processing...";
//                 description = "Processing and analyzing your document content";
//                 details = uploadState.fileId && `Session ID: ${uploadState.fileId}`;
//             } else if (uploadState.indexing) {
//                 title = "Indexing...";
//                 description = "Creating intelligent search index for your document";
//                 details = uploadState.processingStats &&
//                     `Processing completed: ${uploadState.processingStats.insertedRecords} chunks created`;
//             }
//
//             return (
//                 <motion.div
//                     className="upload-status"
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.5 }}
//                 >
//                     <Loader className="status-icon spinner" />
//                     <div>
//                         <h4>{title}</h4>
//                         <p>{description}</p>
//                         {details && <div className="upload-details">{details}</div>}
//
//                         {(uploadState.processing || uploadState.indexing) && (
//                             <motion.div
//                                 className="progress-bar-container"
//                                 initial={{ width: 0 }}
//                                 animate={{ width: "100%" }}
//                                 transition={{
//                                     duration: uploadState.processing ? 3 : 2,
//                                     ease: "linear"
//                                 }}
//                             />
//                         )}
//                     </div>
//                 </motion.div>
//             );
//         }
//
//         return null;
//     };
//
//     // إنشاء الجزيئات المتحركة في الخلفية
//     const particles = Array.from({ length: 20 }).map((_, i) => ({
//         id: i,
//         x: Math.random() * 100,
//         y: Math.random() * 100,
//         size: 3 + Math.random() * 5,
//         duration: 10 + Math.random() * 20
//     }));
//
//     // فتح مربع حوار اختيار الملف
//     const openFileDialog = () => {
//         if (uploaderRef.current) {
//             // استخدام واجهة المكون الخاصة بالرفع
//             uploaderRef.current.querySelector('input[type="file"]').click();
//         }
//     };
//
//     return (
//         <div className={`home-page ${darkMode ? 'dark' : ''}`}>
//             <div className="main-content">
//                 <div className="hero-section">
//                     <motion.div
//                         className="hero-container"
//                         initial={{ opacity: 0, y: 30 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.8 }}
//                     >
//                         <motion.h1
//                             initial={{ opacity: 0 }}
//                             animate={{ opacity: 1 }}
//                             transition={{ delay: 0.2, duration: 0.8 }}
//                             data-text="Intelligent Document Conversations"
//                             className="animated-gradient-text"
//                         >
//                             Intelligent Document Conversations
//                         </motion.h1>
//
//                         <motion.p
//                             className="hero-description"
//                             initial={{ opacity: 0 }}
//                             animate={{ opacity: 1 }}
//                             transition={{ delay: 0.4, duration: 0.8 }}
//                         >
//                             Upload your documents and instantly start asking questions, extracting insights,
//                             and exploring content with our advanced AI-powered system.
//                         </motion.p>
//
//                         <motion.div
//                             className="upload-container"
//                             initial={{ opacity: 0 }}
//                             animate={{ opacity: 1 }}
//                             transition={{ delay: 0.6, duration: 0.8 }}
//                         >
//                             <motion.div
//                                 className="file-upload-preview"
//                                 animate={{ rotate: isHovering ? [-2, 2, -2, 0] : 0 }}
//                                 transition={{ duration: 1, repeat: isHovering ? Infinity : 0 }}
//                                 onMouseEnter={() => setIsHovering(true)}
//                                 onMouseLeave={() => setIsHovering(false)}
//                             >
//                                 <motion.div
//                                     className={`file-icon ${documentType}`}
//                                     animate={{ rotateY: isHovering ? [0, 10, -10, 0] : 0 }}
//                                     transition={{ duration: 2, repeat: isHovering ? Infinity : 0 }}
//                                 >
//                                     <span className="file-ext">{documentType}</span>
//                                 </motion.div>
//                             </motion.div>
//
//                             <div ref={uploaderRef} className="uploader-container">
//                                 <PDFUploader
//                                     onUploadStart={handleUploadStart}
//                                     onUploadError={handleUploadError}
//                                     disabled={uploadState.uploading || uploadState.processing || uploadState.indexing}
//                                     buttonText="Upload Your Document"
//                                     loadingText="Processing..."
//                                     allowedFileTypes=".pdf,.doc,.docx,.txt,.rtf,.odt"
//                                     maxFileSize={25}
//                                     className="custom-uploader"
//                                 />
//                             </div>
//
//                             <motion.button
//                                 className="upload-button"
//                                 onClick={openFileDialog}
//                                 onMouseEnter={() => setIsHovering(true)}
//                                 onMouseLeave={() => setIsHovering(false)}
//                                 disabled={uploadState.uploading || uploadState.processing || uploadState.indexing}
//                                 whileHover={{ scale: 1.05, boxShadow: "0 15px 30px rgba(99, 102, 241, 0.45)" }}
//                                 whileTap={{ scale: 0.98 }}
//                             >
//                                 {uploadState.uploading || uploadState.processing || uploadState.indexing ? (
//                                     <>
//                                         <Loader size={20} className="upload-icon spinner" />
//                                         Processing...
//                                     </>
//                                 ) : (
//                                     <>
//                                         <Upload size={20} className="upload-icon" />
//                                         Upload Your Document
//                                     </>
//                                 )}
//                             </motion.button>
//                         </motion.div>
//
//                         {renderUploadStatus()}
//                     </motion.div>
//                 </div>
//
//                 <motion.div
//                     className="features-section"
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     transition={{ delay: 0.8, duration: 0.8 }}
//                 >
//                     <motion.h2
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ delay: 0.9, duration: 0.8 }}
//                     >
//                         Powerful Features
//                     </motion.h2>
//
//                     <motion.p
//                         className="section-subtitle"
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ delay: 1.0, duration: 0.8 }}
//                     >
//                         Explore our advanced toolset designed to transform how you interact with documents
//                     </motion.p>
//
//                     <div className="features-grid">
//                         {[
//                             { icon: <MessageSquare />, title: "Conversational AI", text: "Chat with your documents in natural language to find answers and insights quickly." },
//                             { icon: <Search />, title: "Semantic Search", text: "Find exactly what you need with intelligent content understanding, not just keyword matching." },
//                             { icon: <Brain />, title: "Smart Analysis", text: "Extract key topics, entities, and relationships automatically from your documents." },
//                             { icon: <Shield />, title: "Privacy-Focused", text: "Your documents stay private and secure with enterprise-grade protection." },
//                             { icon: <Star />, title: "Multi-Format Support", text: "Works with PDFs, Word documents, spreadsheets, presentations, and more." },
//                             { icon: <Cpu />, title: "Real-time Processing", text: "Get instant results with our high-performance document processing engine." },
//                             { icon: <Key />, title: "Custom Accuracy", text: "Fine-tune the system to your specific domain for even better results." },
//                             { icon: <Rocket />, title: "Continuous Learning", text: "The system improves over time with more usage and feedback." }
//                         ].map((feature, index) => (
//                             <motion.div
//                                 className="feature-card"
//                                 key={index}
//                                 initial={{ opacity: 0, y: 30 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 transition={{ delay: 1.1 + (index * 0.1), duration: 0.5 }}
//                                 whileHover={{
//                                     y: -15,
//                                     boxShadow: darkMode
//                                         ? "0 25px 45px rgba(0, 0, 0, 0.25)"
//                                         : "0 25px 45px rgba(0, 0, 0, 0.1)"
//                                 }}
//                             >
//                                 <motion.div
//                                     className="feature-icon"
//                                     whileHover={{ rotate: [0, 10, -10, 0] }}
//                                     transition={{ duration: 0.5 }}
//                                 >
//                                     {feature.icon}
//                                 </motion.div>
//                                 <h3>{feature.title}</h3>
//                                 <p>{feature.text}</p>
//                             </motion.div>
//                         ))}
//                     </div>
//                 </motion.div>
//
//                 <motion.div
//                     className="workflow-section"
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     transition={{ delay: 1.3, duration: 0.8 }}
//                 >
//                     <motion.h2
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ delay: 1.4, duration: 0.8 }}
//                     >
//                         How It Works
//                     </motion.h2>
//
//                     <motion.p
//                         className="section-subtitle"
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ delay: 1.5, duration: 0.8 }}
//                     >
//                         Experience a seamless workflow designed for efficiency and ease of use
//                     </motion.p>
//
//                     <div className="workflow-steps">
//                         {[
//                             { number: 1, title: "Upload", text: "Upload any document in PDF, Word, or text format" },
//                             { number: 2, title: "Process", text: "Our AI analyzes and indexes your document content" },
//                             { number: 3, title: "Converse", text: "Ask questions and get accurate answers instantly" }
//                         ].map((step, index) => (
//                             <React.Fragment key={index}>
//                                 <motion.div
//                                     className="workflow-step"
//                                     initial={{ opacity: 0, y: 30 }}
//                                     animate={{ opacity: 1, y: 0 }}
//                                     transition={{ delay: 1.6 + (index * 0.2), duration: 0.5 }}
//                                     whileHover={{ scale: 1.05, y: -10 }}
//                                 >
//                                     <motion.div
//                                         className="step-number"
//                                         whileHover={{ scale: 1.2, rotate: 360 }}
//                                         transition={{ duration: 0.5 }}
//                                     >
//                                         {step.number}
//                                     </motion.div>
//                                     <h3>{step.title}</h3>
//                                     <p>{step.text}</p>
//                                 </motion.div>
//                                 {index < 2 && (
//                                     <motion.div
//                                         className="workflow-divider"
//                                         initial={{ opacity: 0, width: 0 }}
//                                         animate={{ opacity: 1, width: "80px" }}
//                                         transition={{ delay: 1.8 + (index * 0.2), duration: 0.5 }}
//                                     />
//                                 )}
//                             </React.Fragment>
//                         ))}
//                     </div>
//                 </motion.div>
//
//                 <motion.div
//                     className="formats-section"
//                     initial={{ opacity: 0, y: 30 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: 1.9, duration: 0.8 }}
//                 >
//                     <motion.div
//                         className="formats-container"
//                         whileHover={{ y: -10 }}
//                     >
//                         <motion.div
//                             className="format-icon-wrapper"
//                             animate={{ rotate: [0, 5, -5, 0] }}
//                             transition={{ duration: 3, repeat: Infinity }}
//                         >
//                             <FileText size={35} />
//                         </motion.div>
//                         <h3>Supported Formats</h3>
//                         <p>PDF, DOCX, DOC, TXT, RTF, ODT, XLS, XLSX, PPT, PPTX and more</p>
//                     </motion.div>
//                 </motion.div>
//             </div>
//
//             <div className="floating-particles">
//                 {particles.map(particle => (
//                     <motion.div
//                         key={particle.id}
//                         className="particle"
//                         style={{
//                             width: `${particle.size}px`,
//                             height: `${particle.size}px`,
//                             left: `${particle.x}%`,
//                             top: `${particle.y}%`,
//                         }}
//                         animate={{
//                             y: [0, -100, 0],
//                             x: [0, Math.random() > 0.5 ? 50 : -50, 0],
//                             opacity: [0.3, 0.8, 0.3]
//                         }}
//                         transition={{
//                             repeat: Infinity,
//                             repeatType: "reverse",
//                             duration: particle.duration,
//                             ease: "easeInOut"
//                         }}
//                     />
//                 ))}
//             </div>
//         </div>
//     );
// };
//
// export default EnhancedHomePage;


import React, { useState, useEffect, useContext, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import '../styles/HomePage.css'
// Import Lucide icons
import {
    FileText, Upload, Loader, Check, AlertCircle,
    Brain, MessageSquare, Search, Shield, ChevronDown
} from 'lucide-react';

// Import theme context
import { ThemeContext } from '../contexts/ThemeContext';

// Import upload components and functions
import PDFUploader from '../components/pdf/PDFUploader';
import DocumentService from '../services/DocumentService';
import { formatFileSize, getFileExtension } from '../utils/fileUtils';

/**
 * Enhanced Homepage Component
 * A modern and user-friendly homepage with improved animations,
 * responsive design, and better user experience for document uploads
 */
const EnhancedHomePage = () => {
    // Upload state management
    const [uploadState, setUploadState] = useState({
        uploading: false,
        processing: false,
        error: null,
        success: false,
        fileId: null,
        fileName: "",
        fileSize: 0
    });

    // Animation and UI states
    const { darkMode } = useContext(ThemeContext);
    const navigate = useNavigate();
    const [isHovering, setIsHovering] = useState(false);
    const [documentType, setDocumentType] = useState("pdf");
    const [showFeatures, setShowFeatures] = useState(false);

    // Refs for DOM elements
    const uploaderRef = useRef(null);
    const redirectTimeoutRef = useRef(null);
    const featuresSectionRef = useRef(null);

    /**
     * Handles the start of file upload process
     * @param {File} file - The file to be uploaded
     */
    const handleUploadStart = (file) => {
        setUploadState({
            ...uploadState,
            uploading: true,
            success: false,
            error: null,
            fileName: file.name,
            fileSize: file.size,
        });

        // Update displayed document type
        setDocumentType(getFileExtension(file.name).toLowerCase());

        // Start upload process
        uploadDocument(file);
    };

    /**
     * Handles errors during the upload process
     * @param {Error} error - The error object
     */
    const handleUploadError = (error) => {
        setUploadState({
            ...uploadState,
            uploading: false,
            processing: false,
            error: error.message || "An unknown error occurred during upload."
        });
    };

    /**
     * Uploads document to server
     * @param {File} file - The file to be uploaded
     */
    const uploadDocument = async (file) => {
        try {
            // Upload file
            const uploadResponse = await DocumentService.uploadDocument(file);

            // Update upload state
            setUploadState(prev => ({
                ...prev,
                uploading: false,
                processing: true,
                fileId: DocumentService.getSessionId()
            }));

            // Start processing document
            processDocument();
        } catch (error) {
            console.error("Upload error:", error);
            handleUploadError(error);
        }
    };

    /**
     * Processes the uploaded document on the server side
     */
    const processDocument = async () => {
        try {
            // Process document
            await DocumentService.processDocument();

            // Index document
            await DocumentService.indexDocument();

            // Update indexing state
            setUploadState(prev => ({
                ...prev,
                processing: false,
                success: true
            }));

            // Auto-redirect to chat page after a short delay
            redirectTimeoutRef.current = setTimeout(() => {
                navigate('/chat');
            }, 1200);

        } catch (error) {
            console.error("Processing error:", error);
            setUploadState(prev => ({
                ...prev,
                processing: false,
                error: error.message || "An error occurred during document processing."
            }));
        }
    };

    /**
     * Scrolls to features section
     */
    const scrollToFeatures = () => {
        setShowFeatures(true);
        featuresSectionRef.current?.scrollIntoView({
            behavior: 'smooth'
        });
    };

    /**
     * Renders upload status with appropriate styling and animations
     * @returns {JSX.Element|null} The rendered status component
     */
    const renderUploadStatus = () => {
        if (uploadState.error) {
            return (
                <motion.div
                    className="upload-status-card error"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="status-icon-wrapper error">
                        <AlertCircle size={24} />
                    </div>
                    <div className="status-content">
                        <h4>Upload Failed</h4>
                        <p>{uploadState.error || "An unknown error occurred"}</p>
                        <motion.button
                            className="retry-button"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => openFileDialog()}
                        >
                            Try Again
                        </motion.button>
                    </div>
                </motion.div>
            );
        }

        if (uploadState.success) {
            return (
                <motion.div
                    className="upload-status-card success"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="status-icon-wrapper success">
                        <Check size={24} />
                    </div>
                    <div className="status-content">
                        <h4>Successfully Processed!</h4>
                        <p>Your document is ready. Redirecting to chat...</p>
                        <motion.div
                            className="progress-bar success-progress"
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 1.2, ease: "linear" }}
                        />
                    </div>
                </motion.div>
            );
        }

        if (uploadState.uploading || uploadState.processing) {
            const title = uploadState.uploading ? "Uploading" : "Processing";
            const description = uploadState.uploading
                ? `Uploading ${uploadState.fileName || "document"}...`
                : "Analyzing and processing your document...";

            return (
                <motion.div
                    className="upload-status-card loading"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="status-icon-wrapper loading">
                        <Loader className="spinner" size={24} />
                    </div>
                    <div className="status-content">
                        <h4>{title}</h4>
                        <p>{description}</p>
                        <div className="progress-container">
                            <motion.div
                                className="progress-bar loading-progress"
                                initial={{ width: 0 }}
                                animate={{
                                    width: "100%",
                                    transition: {
                                        duration: uploadState.uploading ? 2 : 3,
                                        ease: "linear",
                                        repeat: Infinity
                                    }
                                }}
                            />
                        </div>
                        {uploadState.fileName && (
                            <div className="file-info">
                                <span className="file-name">{uploadState.fileName}</span>
                                <span className="file-size">
                  {formatFileSize(uploadState.fileSize)}
                </span>
                            </div>
                        )}
                    </div>
                </motion.div>
            );
        }

        return null;
    };

    /**
     * Opens the file upload dialog
     */
    const openFileDialog = () => {
        if (uploaderRef.current) {
            uploaderRef.current.querySelector('input[type="file"]').click();
        }
    };

    // Rotate document types for display when no file is selected
    useEffect(() => {
        if (!uploadState.fileName) {
            const types = ["pdf", "docx", "txt", "rtf"];
            const interval = setInterval(() => {
                setDocumentType(types[Math.floor(Math.random() * types.length)]);
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [uploadState.fileName]);

    // Clean up timeout on unmount
    useEffect(() => {
        return () => {
            if (redirectTimeoutRef.current) {
                clearTimeout(redirectTimeoutRef.current);
            }
        };
    }, []);

    return (
        <div className={`homepage ${darkMode ? 'dark-mode' : 'light-mode'}`}>
            <main className="main-content">
                <section className="hero-section">
                    <div className="hero-content">
                        <motion.h1
                            className="hero-title"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <span className="gradient-text">Chat</span> with your documents
                        </motion.h1>

                        <motion.p
                            className="hero-subtitle"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            Upload your PDFs and documents, then ask questions, extract insights,
                            and explore content with our advanced AI-powered system.
                        </motion.p>

                        <motion.div
                            className="upload-container"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            <div
                                className="document-preview"
                                onMouseEnter={() => setIsHovering(true)}
                                onMouseLeave={() => setIsHovering(false)}
                            >
                                <motion.div
                                    className={`document-icon ${documentType}`}
                                    animate={{
                                        rotateY: isHovering ? [0, 10, -10, 0] : 0,
                                        y: isHovering ? [-5, 5, -5, 0] : 0
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: isHovering ? Infinity : 0,
                                        repeatType: "reverse"
                                    }}
                                >
                                    <span className="document-type">{documentType}</span>
                                </motion.div>
                            </div>

                            <div className="upload-action">
                                <div ref={uploaderRef} className="uploader-container">
                                    <PDFUploader
                                        onUploadStart={handleUploadStart}
                                        onUploadError={handleUploadError}
                                        disabled={uploadState.uploading || uploadState.processing}
                                        buttonText="Upload Your Document"
                                        loadingText="Processing..."
                                        allowedFileTypes=".pdf,.doc,.docx,.txt,.rtf,.odt"
                                        maxFileSize={25}
                                        className="hidden-uploader"
                                    />
                                </div>

                                <motion.button
                                    className="upload-button"
                                    onClick={openFileDialog}
                                    disabled={uploadState.uploading || uploadState.processing}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.98 }}
                                    onMouseEnter={() => setIsHovering(true)}
                                    onMouseLeave={() => setIsHovering(false)}
                                >
                                    {uploadState.uploading || uploadState.processing ? (
                                        <>
                                            <Loader size={20} className="button-icon spinner" />
                                            <span>Processing...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Upload size={20} className="button-icon" />
                                            <span>Upload Document</span>
                                        </>
                                    )}
                                </motion.button>

                                <p className="file-types">
                                    Supported formats: PDF, DOCX, TXT, RTF
                                </p>
                            </div>
                        </motion.div>

                        <AnimatePresence>
                            {renderUploadStatus()}
                        </AnimatePresence>

                        <motion.div
                            className="scroll-indicator"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, y: [0, 10, 0] }}
                            transition={{
                                delay: 1.2,
                                duration: 1.5,
                                repeat: Infinity,
                                repeatType: "loop"
                            }}
                            onClick={scrollToFeatures}
                        >
                            <p>Discover more</p>
                            <ChevronDown size={24} />
                        </motion.div>
                    </div>

                    <div className="hero-background">
                        <div className="gradient-blob blob-1"></div>
                        <div className="gradient-blob blob-2"></div>
                        <div className="gradient-blob blob-3"></div>
                    </div>
                </section>

                <section
                    ref={featuresSectionRef}
                    className={`features-section ${showFeatures ? 'visible' : ''}`}
                    id="features"
                >
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        animate={showFeatures ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6 }}
                        className="section-title"
                    >
                        Powerful Features
                    </motion.h2>

                    <div className="features-grid">
                        {[
                            {
                                icon: <MessageSquare />,
                                title: "Chat Interface",
                                description: "Ask questions in natural language and get instant answers from your documents."
                            },
                            {
                                icon: <Search />,
                                title: "Smart Search",
                                description: "Find exactly what you need with context-aware search that understands semantics."
                            },
                            {
                                icon: <Brain />,
                                title: "AI Analysis",
                                description: "Extract insights, summarize content, and identify key topics automatically."
                            },
                            {
                                icon: <Shield />,
                                title: "Privacy First",
                                description: "Your documents remain private with secure processing and enterprise-grade encryption."
                            }
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                className="feature-card"
                                initial={{ opacity: 0, y: 50 }}
                                animate={showFeatures ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.6, delay: 0.1 * index }}
                                whileHover={{
                                    y: -10,
                                    boxShadow: darkMode
                                        ? "0 20px 40px rgba(0, 0, 0, 0.3)"
                                        : "0 20px 40px rgba(99, 102, 241, 0.15)"
                                }}
                            >
                                <div className="feature-icon-wrapper">
                                    <motion.div
                                        className="feature-icon"
                                        whileHover={{ rotate: [0, -10, 10, 0] }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        {feature.icon}
                                    </motion.div>
                                </div>
                                <h3>{feature.title}</h3>
                                <p>{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                <section className="how-it-works">
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        animate={showFeatures ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="section-title"
                    >
                        How It Works
                    </motion.h2>

                    <div className="steps-container">
                        {[
                            {
                                number: "01",
                                title: "Upload your document",
                                description: "Upload any PDF, DOCX, TXT or RTF file to get started."
                            },
                            {
                                number: "02",
                                title: "AI processes content",
                                description: "Our advanced AI analyzes and indexes your document for quick retrieval."
                            },
                            {
                                number: "03",
                                title: "Chat & explore",
                                description: "Ask questions, request summaries, or explore specific sections naturally."
                            }
                        ].map((step, index) => (
                            <motion.div
                                key={index}
                                className="step-card"
                                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                                animate={showFeatures ? { opacity: 1, x: 0 } : {}}
                                transition={{ duration: 0.6, delay: 0.5 + (0.1 * index) }}
                            >
                                <div className="step-number">{step.number}</div>
                                <div className="step-content">
                                    <h3>{step.title}</h3>
                                    <p>{step.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>
            </main>


        </div>
    );
};

export default EnhancedHomePage;