package com.example.demo.repository;

import com.example.demo.entity.Pdf;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface PdfRepository extends MongoRepository<Pdf, String> {

    @Query(value = "{'titre': { $regex: ?0, $options: 'i' }}")
    List<Pdf> findByTitreContainingIgnoreCase(String titre);

    @Query("{'versions.user._id': ?0}")
    List<Pdf> findByUserId(String userId);

    @Query("{ '_id': ?0, 'versions.id': ?1 }")
    Pdf findPdfByPdfIdAndPdfDocId(String pdfId, String pdfDocId);

}

