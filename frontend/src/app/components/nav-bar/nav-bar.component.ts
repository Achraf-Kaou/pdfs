import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PdfDocument } from '../../models/Pdf';
import { PdfService } from '../../services/Pdf.service';
import { CommonModule } from '@angular/common';
import { User } from '../../models/User';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css',
})
export class NavBarComponent implements OnInit {
  @Input() pdfPageUrl!: boolean;
  @Input() pdf!: PdfDocument | null;

  constructor(
    private router: Router,
    private pdfService: PdfService,
  ) {}

  ngOnInit(): void {

  }

  isActive(url: string): boolean {
    return this.router.url === url;
  }

  logout() {
    localStorage.removeItem('user');
    this.router.navigateByUrl('/');
  }

  save() {
    
  }

  cancel() {}
}

