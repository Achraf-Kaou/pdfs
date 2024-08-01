import { PdfDocument } from "./PdfDocument";

export interface Pdf {
    id?: string;
    titre: string;
    description: string;
    versions: PdfDocument[];
}
