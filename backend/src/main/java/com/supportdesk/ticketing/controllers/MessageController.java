package com.supportdesk.ticketing.controllers;

import com.supportdesk.ticketing.dto.MessageRequest;
import com.supportdesk.ticketing.dto.MessageResponse;
import com.supportdesk.ticketing.entities.User;
import com.supportdesk.ticketing.repositories.UserRepository;
import com.supportdesk.ticketing.services.MessageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets/{ticketId}/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<MessageResponse>> getMessages(@PathVariable Long ticketId) {
        return ResponseEntity.ok(messageService.getMessagesByTicket(ticketId));
    }

    @PostMapping
    public ResponseEntity<MessageResponse> addMessage(
            @PathVariable Long ticketId,
            @Valid @RequestBody MessageRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        MessageResponse response = messageService.addMessage(ticketId, request, user);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
}
