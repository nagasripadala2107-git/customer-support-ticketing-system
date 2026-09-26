package com.supportdesk.ticketing.controllers;

import com.supportdesk.ticketing.dto.ClassificationRequest;
import com.supportdesk.ticketing.dto.ClassificationResponse;
import com.supportdesk.ticketing.services.ClassificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/classification")
@RequiredArgsConstructor
public class ClassificationController {

    private final ClassificationService classificationService;

    @PostMapping("/predict")
    public ResponseEntity<ClassificationResponse> predictCategory(@Valid @RequestBody ClassificationRequest request) {
        ClassificationResponse response = classificationService.classifyTicket(request.getSubject(), request.getDescription());
        return ResponseEntity.ok(response);
    }
}
