package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import com.example.demo.entity.Counter;

@Service
public class SequenceGeneratorService {

    @Autowired
    private MongoOperations mongoOperations;

    @SuppressWarnings("null")
    public long getNextSequence(String seqName) {
        Counter counter = mongoOperations.findAndModify(
            Query.query(Criteria.where("_id").is(seqName)),
            new Update().inc("seq", 1),
            FindAndModifyOptions.options().returnNew(true).upsert(true),
            Counter.class);
        return counter.getSeq();
    }
}
