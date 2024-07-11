package com.example.demo.controller;

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


@RestController
@RequestMapping("/api/pdf")
public class PdfController {
    
    private final PdfService pdfService;
    private final UserRepository userRepository;

    public PdfController(UserRepository userRepository, PdfService pdfService ) {
        this.userRepository = userRepository;
        this.pdfService = pdfService;
       /*  this.jwtService = jwtService; */
    }

    @PostMapping("/upload")
    public ResponseEntity<PdfDocument> uploadPdf(
            @RequestParam("file") MultipartFile file,
            @RequestParam("description") String description,
            @RequestParam("user") String userId) {
        try {
            Optional<User> userOptional = userRepository.findById(userId);
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                PdfDocument savedPdf = pdfService.savePdf(file, description, new Date(), user);
                return ResponseEntity.ok(savedPdf);
            } else {
                return ResponseEntity.status(404).body(null); // User not found
            }
        } catch (IOException e) {
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping
    public List<PdfDocument> getAllPdfs() {
        return pdfService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PdfDocument> getPdfById(@PathVariable String id) {
        PdfDocument pdf = pdfService.getPdfById(id);
        return ResponseEntity.ok(pdf);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePdf(@PathVariable String id) {
        pdfService.deletePdf(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PdfDocument> updatePDF(
        @PathVariable String id, 
        @RequestParam("file") MultipartFile file,
        @RequestParam("user") String userId
        ) {
        try {
            Optional<User> userOptional = userRepository.findById(userId);
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                Optional<PdfDocument> updatedDocument = pdfService.updatePdfDocument(id, file, new Date(), user);
                return updatedDocument.map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.notFound().build());
                } else {
                    return ResponseEntity.status(404).body(null); // User not found
                }
        } catch (IOException e) {
            return ResponseEntity.status(500).build();
        }
    }
}
