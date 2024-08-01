package com.example.demo.service;

import com.example.demo.entity.Pdf;
import com.example.demo.entity.PdfDocument;
import com.example.demo.entity.User;
import com.example.demo.repository.PdfRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class PdfService {

    @Autowired
    private PdfRepository pdfRepository;

    @Autowired
    private SequenceGeneratorService sequenceGeneratorService;

    public Pdf savePdf(String titre, MultipartFile file, String description, Date date, User user) throws IOException {
        PdfDocument pdfDocument = new PdfDocument();
        pdfDocument.setId(String.valueOf(sequenceGeneratorService.getNextSequence("pdfDocumentId")));
        pdfDocument.setSize(file.getSize());
        pdfDocument.setUser(user);
        pdfDocument.setDate(date);
        pdfDocument.setData(file.getBytes());

        List<PdfDocument> versions = new ArrayList<>();
        versions.add(pdfDocument);

        Pdf pdf = new Pdf(titre, description, versions);
        return pdfRepository.save(pdf);
    }

    public void deletePdf(String id) {
        pdfRepository.deleteById(id);
    }

    public List<Pdf> findAll() {
        return pdfRepository.findAll();
    }

    //by pdf id 
    public Pdf getPdfById(String id) {
        return pdfRepository.findById(id).orElse(null);
    }

    public Optional<Pdf> updatePdfDocument(String pdfId, MultipartFile file, Date date, User user) throws IOException {
        Optional<Pdf> optionalPdf = pdfRepository.findById(pdfId);

        if (optionalPdf.isPresent()) {
            Pdf pdf = optionalPdf.get();

            // Create new version
            PdfDocument newVersion = new PdfDocument();
            newVersion.setId(String.valueOf(sequenceGeneratorService.getNextSequence("pdfDocumentId")));
            newVersion.setSize(file.getSize());
            newVersion.setUser(user);
            newVersion.setDate(date);
            newVersion.setData(file.getBytes());

            // Add new version to the list of versions
            pdf.getVersions().add(newVersion);

            // Save the updated PDF
            pdfRepository.save(pdf);

            return Optional.of(pdf);
        }

        return Optional.empty();
    }
    

    public List<Pdf> getPdfsFiltered(String titre) {
        if (titre.endsWith(".pdf")) {
            titre = titre.substring(0, titre.length() - 4); // Remove ".pdf"
        }
        return pdfRepository.findByTitreContainingIgnoreCase(titre);
    }

    public List<Pdf> getPdfsByUserId(String userId) {
        // Implement this method if needed
        // You might need to add a custom query to filter PDFs by userId
        return pdfRepository.findByUserId(userId);
    }

    public Optional<PdfDocument> getPdfDocByPdfId(String pdfId, String pdfDocId) {
        Pdf pdf = pdfRepository.findPdfByPdfIdAndPdfDocId(pdfId, pdfDocId);
        if (pdf != null) {
            return pdf.getVersions().stream()
                .filter(version -> version.getId().equals(pdfDocId))
                .findFirst();
        }
        return Optional.empty();
    }
}
