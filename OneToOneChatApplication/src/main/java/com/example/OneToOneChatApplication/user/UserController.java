package com.example.OneToOneChatApplication.user;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.ResponseEntity;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final SimpMessagingTemplate messagingTemplate;

    @PostMapping("/users.add")
     public ResponseEntity<User> addUser(@RequestBody User user) {
        userService.saveUser(user);
        notifyOnlineUsers(); // Corrected method name
        return ResponseEntity.ok(user);
    }

    @MessageMapping("/user.disconnectUser")
    public void disconnectUser(@Payload User user) {
        userService.disconnect(user);
        notifyOnlineUsers();
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> findConnectedUsers() {
        return ResponseEntity.ok(userService.findConnectedUsers());
    }

    private void notifyOnlineUsers() {
        List<User> onlineUsers = userService.findConnectedUsers();
        messagingTemplate.convertAndSend("/topic/onlineUsers", onlineUsers);
    }
}
