// src/types/pdf.ts

export interface PDFFile {
    id: string;
    name: string;
    size: number;
    uploadedAt: Date;
    url?: string;
    processingStatus: 'pending' | 'processing' | 'completed' | 'failed';
    errorMessage?: string;
}

export interface ChatSession {
    id: string;
    title: string;
    pdfId: string;
    createdAt: Date;
    lastMessageAt: Date;
}

export interface UploadPDFResponse {
    success: boolean;
    file?: PDFFile;
    error?: string;
}