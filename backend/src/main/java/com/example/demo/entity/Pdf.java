package com.example.demo.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document
public class Pdf {
    @Id
    private String id;
    private String titre;
    private String description;
    private List<PdfDocument> versions;

    // Constructors, getters, and setters
    public Pdf() {
    }

    public Pdf(String titre, String description, List<PdfDocument> versions) {
        this.titre = titre;
        this.description = description;
        this.versions = versions;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitre() {
        return titre;
    }

    public void setTitre(String titre) {
        this.titre = titre;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<PdfDocument> getVersions() {
        return versions;
    }

    public void setVersions(List<PdfDocument> versions) {
        this.versions = versions;
    }
}
