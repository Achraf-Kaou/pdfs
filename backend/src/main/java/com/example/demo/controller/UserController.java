package com.example.demo.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/* import com.example.demo.LoginResponse; */
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
/* import com.example.demo.service.JwtService; */
import com.example.demo.service.UserService;



@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;
    /* private final JwtService jwtService; */
    public UserController(/* JwtService jwtService, */ UserService userService, UserRepository userRepository ) {
        this.userService = userService;
        this.userRepository = userRepository;
       /*  this.jwtService = jwtService; */
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        try {
            List<User> users = userService.getAllUsers();
            return new ResponseEntity<>(users, HttpStatus.OK);
        } catch (Exception e) {
            // Handle any exceptions and return appropriate response
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /* @GetMapping("/role/{role}")
    public ResponseEntity<List<User>> getUsersByRole(@PathVariable String role) {
        List<User> users = userService.getUsersByRole(role);
        return new ResponseEntity<>(users, HttpStatus.OK);
    }
    */

    @PostMapping
    public ResponseEntity<User> addUser(@RequestBody User user) {
        try {
            User newUser = userService.save(user);
            return new ResponseEntity<>(newUser, HttpStatus.CREATED);
        }catch (Exception e) {
            // Handle any exceptions and return appropriate response
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> editUser(@PathVariable String id, @RequestBody User user) {
        User updatedUser = userService.update(id, user);
        return new ResponseEntity<>(updatedUser, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody User user) {
        User response = userService.authenticate(user);
        if (response != null) {
            return ResponseEntity.ok(response); // Authentication successful, return user details
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // Authentication failed
        }
    }

    @GetMapping("/count")
    public long getUserCount() {
        return userRepository.count();
    }
}
