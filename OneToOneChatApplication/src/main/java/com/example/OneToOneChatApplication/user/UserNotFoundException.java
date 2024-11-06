package com.example.OneToOneChatApplication.user;



public class UserNotFoundException extends RuntimeException {

    private static final long serialVersionUID = 1L; // Explicitly declare serialVersionUID

    public UserNotFoundException(String message) {
        super(message);
    }
}
