package com.example.demo.service;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.List;

@Service
public class UserService {

    @Autowired
    private final UserRepository userRepository;


    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    /* public List<User> getUsersByRole(String role) {
        return userRepository.findByRole(role);
    }

    public User getUserById(String id) {
        Optional<User> optionalUser = userRepository.findById(id);
        return optionalUser.orElse(null); // Return null if user with given id is not found
    } */

    public User save(User user) {
        return userRepository.save(user);
    }

    public User update(String id, User user) {
        if (userRepository.existsById(id)) {
            user.setId(id); // Ensure the user ID is set for update
            return userRepository.save(user);
        }
        return null; // Handle appropriately if user with given id does not exist
    }

    public void deleteUser(String id) {
        userRepository.deleteById(id);
    }

    public User authenticate(User user) {
        User response = userRepository.findByEmail(user.getEmail());
        if (response != null && response.getPassword().equals(user.getPassword())) {
            return response; // Authentication successful
        }
        return null; // Authentication failed
    }
}
