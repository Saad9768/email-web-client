export interface EmailData {
    toEmail: string[];
    ccEmail: string[];
    bccEmail: string[];
    subject: string;
    description: string;
    requestId: string;
}