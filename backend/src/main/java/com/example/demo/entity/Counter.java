package com.example.demo.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

@Data
@Document(collection = "counters")
public class Counter {
    @Id
    private String id;
    private long seq;

    // Constructors, getters, and setters
}
