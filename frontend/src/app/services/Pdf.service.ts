import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PdfDocument } from '../models/Pdf';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  

  private uploadUrl = 'http://localhost:8080/api/pdf';

  constructor(private http: HttpClient) { }

  upload(formData: FormData): Observable<any> {
    const req = new HttpRequest('POST', this.uploadUrl+"/upload" , formData, {
      reportProgress: true,
    });
    return this.http.request(req);
  }
  getPdfs(): Observable<PdfDocument[]> {
    return this.http.get<PdfDocument[]>(this.uploadUrl);
  }

  getPdfById(id: string | null): Observable<PdfDocument> {
    return this.http.get<PdfDocument>(`${this.uploadUrl}/${id}`);
  }

  updatePdf(formData: FormData, id: string | null): Observable<any> {
    const req = new HttpRequest('put', this.uploadUrl+`/${id}` , formData, {
      reportProgress: true,
    });
    return this.http.request(req);
  }

  deletePdf(id: Object | undefined): Observable<any> {
    return this.http.delete(`${this.uploadUrl}/${id}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
  }

  getPdfsFiltered(filterValue: string| null): Observable<PdfDocument[]> {
    if (filterValue === null){
      return this.getPdfs();
    }
    return this.http.get<PdfDocument[]>(`${this.uploadUrl}/filtered?titre=${filterValue}`);
  }

  getPdfsByUserId(userId: string): Observable<PdfDocument[]> {
    return this.http.get<PdfDocument[]>(`${this.uploadUrl}/pdfs/byUser?userId=${userId}`);
  }
}
