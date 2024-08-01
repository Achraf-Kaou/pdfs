import { User } from "./User";

export interface PdfDocument {
    id?: string;
    size: number;
    user: User;
    date: Date;
    data: Uint8Array;
}
