package com.supportdesk.ticketing.controllers;

import com.supportdesk.ticketing.dto.AuthRequest;
import com.supportdesk.ticketing.dto.AuthResponse;
import com.supportdesk.ticketing.dto.RegisterRequest;
import com.supportdesk.ticketing.entities.*;
import com.supportdesk.ticketing.repositories.AgentRepository;
import com.supportdesk.ticketing.repositories.CustomerRepository;
import com.supportdesk.ticketing.repositories.UserRepository;
import com.supportdesk.ticketing.security.JwtTokenProvider;
import com.supportdesk.ticketing.services.AuditService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final AgentRepository agentRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditService auditService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        String token = tokenProvider.generateToken(authentication);
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        auditService.recordAudit(user, "USER_LOGIN", "USER", user.getId(), "User logged in successfully");

        return ResponseEntity.ok(buildAuthResponse(user, token));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already registered: " + request.getEmail());
        }

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .role(Role.ROLE_CUSTOMER)
                .phone(request.getPhone())
                .isActive(true)
                .build();

        user = userRepository.save(user);

        Customer customer = Customer.builder()
                .user(user)
                .companyName(request.getCompanyName() != null ? request.getCompanyName() : "Individual")
                .accountTier("STANDARD")
                .build();

        customerRepository.save(customer);

        String token = tokenProvider.generateTokenFromEmail(user.getEmail());

        auditService.recordAudit(user, "USER_REGISTER", "USER", user.getId(), "Customer registration completed");

        return ResponseEntity.ok(buildAuthResponse(user, token));
    }

    @GetMapping("/me")
    public ResponseEntity<AuthResponse> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return ResponseEntity.ok(buildAuthResponse(user, null));
    }

    private AuthResponse buildAuthResponse(User user, String token) {
        Long customerId = null;
        Long agentId = null;
        Long teamId = null;
        String teamName = null;

        if (user.getRole() == Role.ROLE_CUSTOMER) {
            Customer c = customerRepository.findByUserId(user.getId()).orElse(null);
            if (c != null) customerId = c.getId();
        } else if (user.getRole() == Role.ROLE_AGENT) {
            Agent a = agentRepository.findByUserId(user.getId()).orElse(null);
            if (a != null) {
                agentId = a.getId();
                if (a.getTeam() != null) {
                    teamId = a.getTeam().getId();
                    teamName = a.getTeam().getName();
                }
            }
        }

        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole().name())
                .customerId(customerId)
                .agentId(agentId)
                .teamId(teamId)
                .teamName(teamName)
                .build();
    }
}
