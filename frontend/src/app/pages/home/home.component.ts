import { Component } from '@angular/core';
import { NavBarComponent } from "../../components/nav-bar/nav-bar.component";
import { PdfListComponent } from "../../components/pdfs/pdf-list/pdf-list.component";
import { debounceTime, distinctUntilChanged, Observable } from 'rxjs';
import { PdfDocument } from '../../models/Pdf';
import { FormControl } from '@angular/forms';
import { PdfService } from '../../services/Pdf.service';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../models/User';

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
    imports: [NavBarComponent, PdfListComponent]
})
export class HomeComponent {
    pdfs$: Observable<PdfDocument[]> | null = null;
    filter = new FormControl('');
    searchQuery!: string;

    constructor(private pdfService: PdfService, private route: ActivatedRoute) {}

    ngOnInit(): void {
      if (this.searchQuery){
        this.route.queryParams.subscribe(params => {
          this.searchQuery = params['search'];
          this.fetchPdfs();
        });
      }else{
        this.loadPdfs();
      }
    }

    
    
    fetchPdfs(): void {
      this.pdfs$ = this.pdfService.getPdfsFiltered(this.searchQuery);
    }
    loadPdfs(filterValue: string = ''): void {
      this.pdfs$ = this.pdfService.getPdfsFiltered(filterValue);
    }

    onSearchValueChange(searchValue: string): void {
      this.loadPdfs(searchValue);
    }

}
