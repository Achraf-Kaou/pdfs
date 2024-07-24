package com.example.demo.service;


import com.example.demo.entity.PdfDocument;
import com.example.demo.entity.User;
import com.example.demo.repository.PdfRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class PdfService {

    @Autowired
    private PdfRepository pdfRepository;

    public PdfDocument savePdf(String titre, MultipartFile file, String description, Date date, User user) throws IOException {
        PdfDocument pdfDocument = new PdfDocument();
        pdfDocument.setTitre(titre);
        pdfDocument.setDescription(description);
        pdfDocument.setDateHistory(date);
        pdfDocument.setUserHistory(user);
        pdfDocument.setData(file.getBytes());
        pdfDocument.setSize(file.getSize());
        return pdfRepository.save(pdfDocument);
    }

    public void deletePdf(String id) {
        pdfRepository.deleteById(id);
    }

    public List<PdfDocument> findAll() {
        return pdfRepository.findAll();
    }

    public PdfDocument getPdfById(String id) {
        return pdfRepository.findById(id).orElse(null);
    }

    public Optional<PdfDocument> updatePdfDocument(String id, MultipartFile file, Date date, User user) throws IOException {
        Optional<PdfDocument> existingDocument = pdfRepository.findById(id);
        if (existingDocument.isPresent()) {
            PdfDocument document = existingDocument.get();
            document.setData(file.getBytes());
            document.setDateHistory(date);
            document.setUserHistory(user);
            document.setSize(file.getSize());
            return Optional.of(pdfRepository.save(document));
        }
        return Optional.empty();
    }

    public List<PdfDocument> getPdfsFiltered(String titre) {
        if (titre.endsWith(".pdf")) {
            titre = titre.substring(0, titre.length() - 4); // Remove ".pdf"
            System.out.println("Hello, World!");
        }
        return pdfRepository.findByTitreContainingIgnoreCase(titre);
    }

    public List<PdfDocument> getPdfsByUserId(String userId) {
        return pdfRepository.findByUserId(userId);
    }
}

