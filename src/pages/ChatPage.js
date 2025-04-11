// // src/pages/ChatPage.jsx
// import React, { useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import MainLayout from '../components/layout/MainLayout';
// import ChatContainer from '../components/chat/ChatContainer';
// import PDFViewer from '../components/pdf/PDFViewer';
// import Loader from '../components/common/Loader';
// import { useChatContext } from '../contexts/ChatContext';
// import { usePDFContext } from '../contexts/PDFContext';
//
// const ChatPage = () => {
//     const { chatId } = useParams();
//     const navigate = useNavigate();
//     const {
//         fetchChat,
//         currentChat,
//         isLoading: isChatLoading,
//         error: chatError
//     } = useChatContext();
//
//     const {
//         getPDFInfo,
//         currentPDF,
//         error: pdfError
//     } = usePDFContext();
//
//     // Fetch chat on initial load or chatId change
//     useEffect(() => {
//         if (chatId) {
//             fetchChat(chatId).then(chat => {
//                 if (chat && chat.pdfId) {
//                     getPDFInfo(chat.pdfId);
//                 }
//             });
//         }
//     }, [chatId, fetchChat, getPDFInfo]);
//
//     // Handle invalid chat ID
//     useEffect(() => {
//         if (!isChatLoading && chatError) {
//             // Redirect to home page if chat doesn't exist
//             navigate('/', { replace: true });
//         }
//     }, [chatError, isChatLoading, navigate]);
//
//     return (
//         <MainLayout>
//             <div className="flex flex-col md:flex-row h-full">
//                 {isChatLoading ? (
//                     <div className="flex-1 flex items-center justify-center">
//                         <Loader size="large" />
//                     </div>
//                 ) : (
//                     <>
//                         {/* PDF Viewer */}
//                         <div className="md:w-1/2 h-1/2 md:h-full border-b md:border-r md:border-b-0 border-gray-200">
//                             <PDFViewer pdfId={currentChat?.pdfId} />
//                         </div>
//
//                         {/* Chat Container */}
//                         <div className="md:w-1/2 h-1/2 md:h-full flex flex-col">
//                             <ChatContainer
//                                 chatId={chatId}
//                                 chatTitle={currentChat?.name || 'Chat with PDF'}
//                             />
//                         </div>
//                     </>
//                 )}
//             </div>
//         </MainLayout>
//     );
// };
//
// export default ChatPage;