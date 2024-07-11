package com.example.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.demo.entity.User;

public interface UserRepository extends MongoRepository<User, String> {
    List<User> findAll();
    List<User> findByRole(String role);
    List<User> findByFirstName(String firstName);
    List<User> findByLastName(String lastName);
    Optional<User> findById(String id);
    // Or use a custom method to query by full name
    List<User> findByFullName(String fullName);
    User findByEmail(String email);
    long count();

}