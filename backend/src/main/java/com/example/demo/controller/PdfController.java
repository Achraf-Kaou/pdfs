package com.example.demo.controller;

import com.example.demo.entity.Pdf;
import com.example.demo.entity.PdfDocument;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.PdfService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import org.springframework.web.bind.annotation.PostMapping;


@RestController
@RequestMapping("/api/pdf")
public class PdfController {

    private final PdfService pdfService;
    private final UserRepository userRepository;

    public PdfController(UserRepository userRepository, PdfService pdfService) {
        this.userRepository = userRepository;
        this.pdfService = pdfService;
    }

    @PostMapping("/upload")
    public ResponseEntity<Pdf> uploadPdf(
            @RequestParam("file") MultipartFile file,
            @RequestParam("description") String description,
            @RequestParam("user") String userId,
            @RequestParam("titre") String titre) {
        try {
            Optional<User> userOptional = userRepository.findById(userId);
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                Pdf savedPdf = pdfService.savePdf(titre, file, description, new Date(), user);
                return ResponseEntity.ok(savedPdf);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); // User not found
            }
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping
    public List<Pdf> getAllPdfs() {
        return pdfService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pdf> getPdfById(@PathVariable String id) {
        Pdf pdf = pdfService.getPdfById(id);
        return pdf != null ? ResponseEntity.ok(pdf) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePdf(@PathVariable String id) {
        pdfService.deletePdf(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PutMapping("update/{id}")
    public ResponseEntity<Pdf> update(
        @PathVariable String id, 
        @RequestParam String titre, 
        @RequestParam String description) {
        try {
            Optional<Pdf> pdfOptional = pdfService.updatePdf(id, titre, description);
            return pdfOptional.map(ResponseEntity::ok)
                   .orElseGet(() -> ResponseEntity.notFound().build());
        }catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    

    @PutMapping("/{id}")
    public ResponseEntity<Pdf> updatePdf(
            @PathVariable String id,
            @RequestParam("file") MultipartFile file,
            @RequestParam("user") String userId) {
        try {
            Optional<User> userOptional = userRepository.findById(userId);
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                Optional<Pdf> updatedPdf = pdfService.updatePdfDocument(id, file, new Date(), user);
                return updatedPdf.map(ResponseEntity::ok)
                        .orElseGet(() -> ResponseEntity.notFound().build());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); // User not found
            }
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @GetMapping("/filtered")
    public List<Pdf> getPdfsFiltered(@RequestParam String titre) {
        return pdfService.getPdfsFiltered(titre);
    }

    @GetMapping("/pdfs/byUser")
    public List<Pdf> getPdfsByUserId(@RequestParam String userId) {
        return pdfService.getPdfsByUserId(userId);
    }

    @GetMapping("/{pdfId}/{pdfDocId}")
    public ResponseEntity<PdfDocument> getPdfDocByPdfId(
            @PathVariable String pdfId, 
            @PathVariable String pdfDocId) {

        Optional<PdfDocument> pdfDocument = pdfService.getPdfDocByPdfId(pdfId, pdfDocId);

        return pdfDocument.map(ResponseEntity::ok)
                          .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
