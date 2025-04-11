// src/components/ChatInterface/ChatInterface.jsx
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getAuth } from 'firebase/auth';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/config';
import ChatWindow from '../ChatWindow/ChatWindow';
import FileSidebar from '../FileSidebar/FileSidebar';
import './ChatInterface.css';

const ChatInterface = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [messages, setMessages] = useState([]);
    const auth = getAuth();
    const queryClient = useQueryClient();
    const currentUser = auth.currentUser;

    // Fetch user files from Firebase
    const { data: userFiles, isLoading: isLoadingFiles } = useQuery(
        ['userFiles', currentUser?.uid],
        async () => {
            if (!currentUser) return [];

            const filesRef = collection(db, `users/${currentUser.uid}/files`);
            const filesSnapshot = await getDocs(
                query(filesRef, orderBy('uploaded_at', 'desc'))
            );

            return filesSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                uploaded_at: doc.data().uploaded_at?.toDate() || new Date()
            }));
        },
        {
            enabled: !!currentUser,
            staleTime: 5 * 60 * 1000, // 5 minutes
        }
    );

    // Fetch chat history when a file is selected
    const { data: chatHistory, isLoading: isLoadingChat } = useQuery(
        ['chatHistory', selectedFile?.id],
        async () => {
            if (!selectedFile) return [];

            const response = await fetch(`/api/v1/nlp/index/chat/${selectedFile.id}`);

            if (!response.ok) {
                throw new Error('Failed to fetch chat history');
            }

            const data = await response.json();
            return data.messages || [];
        },
        {
            enabled: !!selectedFile,
            onSuccess: (data) => {
                setMessages(data);
            }
        }
    );

    // Send message mutation
    const sendMessageMutation = useMutation(
        async ({ fileId, text }) => {
            const response = await fetch(`/api/v1/nlp/index/answer/${fileId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text }),
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            return response.json();
        },
        {
            onSuccess: (data) => {
                // Add the AI response to messages
                setMessages(prevMessages => [
                    ...prevMessages,
                    {
                        id: Date.now().toString(),
                        text: data.answer,
                        sender: 'ai',
                        timestamp: new Date().toISOString()
                    }
                ]);

                // Invalidate chat history query to refresh it next time
                queryClient.invalidateQueries(['chatHistory', selectedFile?.id]);
            }
        }
    );

    const handleFileSelect = (file) => {
        setSelectedFile(file);
    };

    const handleSendMessage = (text) => {
        if (!text.trim() || !selectedFile) return;

        // Optimistically update UI
        const newMessage = {
            id: Date.now().toString(),
            text,
            sender: 'user',
            timestamp: new Date().toISOString()
        };

        setMessages(prevMessages => [...prevMessages, newMessage]);

        // Send to API
        sendMessageMutation.mutate({
            fileId: selectedFile.id,
            text
        });
    };

    return (
        <div className="chat-interface">
            <FileSidebar
                files={userFiles || []}
                isLoading={isLoadingFiles}
                selectedFile={selectedFile}
                onSelectFile={handleFileSelect}
            />
            <ChatWindow
                messages={messages}
                isLoading={isLoadingChat || sendMessageMutation.isLoading}
                selectedFile={selectedFile}
                onSendMessage={handleSendMessage}
            />
        </div>
    );
};

export default ChatInterface;