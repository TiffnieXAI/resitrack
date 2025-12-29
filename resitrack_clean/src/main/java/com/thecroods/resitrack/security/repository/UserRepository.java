package com.thecroods.resitrack.security.repository;

import com.thecroods.resitrack.security.models.UserModel;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends MongoRepository<UserModel, String> {
    UserModel findByUsername(String username);
}