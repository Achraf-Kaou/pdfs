import { User } from "./User";

export interface PdfDocument {
    id?: string;
    titre: string;
    description: string;
    dateHistory: Date[];
    userHistory: User[];
    size: number;
    data: Uint8Array;
}