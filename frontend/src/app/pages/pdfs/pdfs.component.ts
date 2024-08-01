import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { NavBarComponent } from "../../components/nav-bar/nav-bar.component";
import { MypdfsComponent } from "../../components/pdfs/mypdfs/mypdfs.component";
import { PdfListComponent } from "../../components/pdfs/pdf-list/pdf-list.component";
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Pdf } from '../../models/Pdf';
import { PdfService } from '../../services/Pdf.service';

@Component({
  selector: 'app-pdfs',
  standalone: true,
  imports: [MatTabsModule, NavBarComponent, MypdfsComponent, PdfListComponent],
  templateUrl: './pdfs.component.html',
  styleUrl: './pdfs.component.css'
})
export class PdfsComponent {
  pdfDocuments$!: Observable<Pdf[]>;
  searchQuery: string = '';

  constructor(private pdfService: PdfService, private route: ActivatedRoute) {}

  ngOnInit(): void {
      // Retrieve the search query from local storage
      const storedSearchQuery = localStorage.getItem('searchQuery');
      if (storedSearchQuery) {
          this.searchQuery = storedSearchQuery;
      }

      // Watch for query param changes and apply the filter
      this.route.queryParams.subscribe((params) => {
          this.searchQuery = params['search'] || this.searchQuery;
          this.applyFilter(this.searchQuery);
      });

      // Initial filter application
      this.applyFilter(this.searchQuery);
  }

  applyFilter(searchQuery: string | null) {
      this.pdfDocuments$ = this.pdfService.getPdfsFiltered(searchQuery);
  }

  onSearchValueChange(searchQuery: string): void {
      this.searchQuery = searchQuery;
      localStorage.setItem('searchQuery', searchQuery); // Save the search query to local storage
      this.applyFilter(searchQuery);
  }
}
