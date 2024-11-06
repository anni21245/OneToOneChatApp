package com.example.OneToOneChatApplication.chat;

public class ChatRoomNotFoundException extends RuntimeException {

    private static final long serialVersionUID = 1L; // Explicitly declare serialVersionUID

    public ChatRoomNotFoundException(String message) {
        super(message);
    }
}
