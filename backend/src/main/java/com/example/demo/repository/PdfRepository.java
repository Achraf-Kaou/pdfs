package com.example.demo.repository;

import com.example.demo.entity.PdfDocument;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface PdfRepository extends MongoRepository<PdfDocument, String> {

    @Query(value = "{'titre': { $regex: ?0, $options: 'i' }}")
    List<PdfDocument> findByTitreContainingIgnoreCase(String titre);

    @Query("{'userHistory._id': ?0}")
    List<PdfDocument> findByUserId(String userId);
}

