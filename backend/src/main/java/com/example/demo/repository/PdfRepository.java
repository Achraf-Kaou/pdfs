package com.example.demo.repository;

import com.example.demo.entity.PdfDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PdfRepository extends MongoRepository<PdfDocument, String> {
}

