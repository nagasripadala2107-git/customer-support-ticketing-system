package com.supportdesk.ticketing.services;

import com.supportdesk.ticketing.dto.ClassificationRequest;
import com.supportdesk.ticketing.dto.ClassificationResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;
import java.util.Map;

/**
 * Service to communicate with Python FastAPI NLP service.
 * Implements graceful fallback to GENERAL_INQUIRY if the service is unreachable.
 */
@Service
@Slf4j
public class ClassificationService {

    private final WebClient webClient;
    private final String classifierUrl;

    public ClassificationService(
            WebClient.Builder webClientBuilder,
            @Value("${classifier.service.url:http://localhost:8000}") String classifierUrl) {
        this.classifierUrl = classifierUrl;
        this.webClient = webClientBuilder.baseUrl(classifierUrl).build();
    }

    public ClassificationResponse classifyTicket(String subject, String description) {
        log.info("Sending ticket to Python Classifier microservice [{}]: subject='{}'", classifierUrl, subject);
        try {
            ClassificationRequest request = ClassificationRequest.builder()
                    .subject(subject)
                    .description(description)
                    .build();

            ClassificationResponse response = webClient.post()
                    .uri("/predict")
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(ClassificationResponse.class)
                    .timeout(Duration.ofSeconds(3))
                    .block();

            if (response != null && response.getCategory() != null) {
                log.info("Python Classifier returned category='{}' with confidence={}",
                        response.getCategory(), response.getConfidence());
                return response;
            }
        } catch (Exception ex) {
            log.warn("Python Classifier microservice call failed ({}); falling back to GENERAL_INQUIRY rule-based fallback.", ex.getMessage());
        }

        // Graceful Fallback Strategy
        return buildFallbackClassification(subject, description);
    }

    private ClassificationResponse buildFallbackClassification(String subject, String description) {
        String combined = (subject + " " + description).toLowerCase();
        String fallbackCategory = "GENERAL_INQUIRY";
        double fallbackConfidence = 0.50;

        if (combined.contains("bill") || combined.contains("charge") || combined.contains("payment") || combined.contains("invoice")) {
            fallbackCategory = "BILLING";
            fallbackConfidence = 0.85;
        } else if (combined.contains("login") || combined.contains("password") || combined.contains("2fa") || combined.contains("sso") || combined.contains("auth")) {
            fallbackCategory = "ACCOUNT_ACCESS";
            fallbackConfidence = 0.85;
        } else if (combined.contains("shipping") || combined.contains("tracking") || combined.contains("package") || combined.contains("delivery") || combined.contains("courier")) {
            fallbackCategory = "SHIPPING";
            fallbackConfidence = 0.85;
        } else if (combined.contains("refund") || combined.contains("cancel") || combined.contains("reimburse")) {
            fallbackCategory = "REFUND";
            fallbackConfidence = 0.85;
        } else if (combined.contains("crash") || combined.contains("error") || combined.contains("500") || combined.contains("exception") || combined.contains("bug")) {
            fallbackCategory = "TECHNICAL_SUPPORT";
            fallbackConfidence = 0.85;
        }

        return ClassificationResponse.builder()
                .category(fallbackCategory)
                .confidence(fallbackConfidence)
                .targetTeam(mapCategoryToTeam(fallbackCategory))
                .probabilities(Map.of(fallbackCategory, fallbackConfidence))
                .status("FALLBACK_LOCAL_RULES")
                .build();
    }

    private String mapCategoryToTeam(String category) {
        return switch (category) {
            case "BILLING", "REFUND" -> "Billing & Finance Team";
            case "TECHNICAL_SUPPORT" -> "Technical Support Team";
            case "ACCOUNT_ACCESS" -> "Account & Security Team";
            case "SHIPPING" -> "Shipping & Logistics Team";
            case "PRODUCT_ISSUE" -> "Product Engineering Team";
            default -> "Technical Support Team";
        };
    }
}
