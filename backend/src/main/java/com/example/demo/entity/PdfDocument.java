package com.example.demo.entity;

import lombok.Data;
import java.util.Date;


import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;


@Data
@Document(collection = "pdf")
public class PdfDocument {
    @Id
    private String id;
    private long size;
    private User user;
    private Date date;
    private byte[] data;
}