package com.example.demo.entity;

import lombok.Data;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;


@Data
@Document(collection = "pdfs")
public class PdfDocument {
    @Id
    private String id;
    private String titre;
    private String description;
    private List<Date> dateHistory;
    private List<User> userHistory;
    private long size;
    private byte[] data;

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

    public List<Date> getDateHistory() {
        return dateHistory;
    }

    public void setDateHistory(Date date) {
        if (this.dateHistory == null) {
        this.dateHistory = new ArrayList<>();
        }
        this.dateHistory.add(date);
    }

    public List<User> getUserHistory() {
        return userHistory;
    }

    public void setUserHistory(User user) {
        if (this.userHistory == null) {
            this.userHistory = new ArrayList<>();
        }
        this.userHistory.add(user);
    }

    public byte[] getData() {
        return data;
    }

    public void setData(byte[] data) {
        this.data = data;
    }

    

}
