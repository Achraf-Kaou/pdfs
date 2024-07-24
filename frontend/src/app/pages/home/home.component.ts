import { Component, OnInit } from '@angular/core';
import { NavBarComponent } from "../../components/nav-bar/nav-bar.component";
import { PdfListComponent } from "../../components/pdfs/pdf-list/pdf-list.component";
import { PdfDocument } from '../../models/Pdf';
import { PdfService } from '../../services/Pdf.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    imports: [NavBarComponent, PdfListComponent]
})
export class HomeComponent implements OnInit {
    pdfDocuments$!: Observable<PdfDocument[]>;
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
