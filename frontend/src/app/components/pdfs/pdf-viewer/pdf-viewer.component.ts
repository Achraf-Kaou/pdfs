import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import PSPDFKit from 'pspdfkit';

@Component({
  selector: 'app-pdf-viewer',
  standalone: true,
  imports: [],
  templateUrl: './pdf-viewer.component.html',
  styleUrl: './pdf-viewer.component.css'
})
export class PdfViewerComponent implements OnChanges {
  @Input() pdfSrc!: Uint8Array;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pdfSrc'] && this.pdfSrc) {
      this.loadPdf();
    }
  }

  async loadPdf() {
    try {
      const arrayBuffer = this.pdfSrc.buffer; // Convert Uint8Array to ArrayBuffer
      await PSPDFKit.load({
        baseUrl: location.protocol + "//" + location.host + "/assets/",
        document: arrayBuffer, // Use ArrayBuffer here
        container: "#pspdfkit-container",
      }).then(instance => {
        instance.setViewState(viewState => viewState.set("readOnly", true));
        instance.setViewState(viewState => viewState.set("sidebarMode", PSPDFKit.SidebarMode.THUMBNAILS));
        (window as any).instance = instance;
      });
    } catch (error) {
      console.error('Error loading PSPDFKit', error);
    }
  }
}