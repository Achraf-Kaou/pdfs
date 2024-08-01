package com.example.demo.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.demo.entity.Counter;

public interface CounterRepository extends MongoRepository<Counter, String> {
}

