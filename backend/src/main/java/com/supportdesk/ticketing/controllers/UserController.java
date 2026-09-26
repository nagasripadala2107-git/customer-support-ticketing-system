package com.supportdesk.ticketing.controllers;

import com.supportdesk.ticketing.entities.*;
import com.supportdesk.ticketing.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {

    private final CustomerRepository customerRepository;
    private final AgentRepository agentRepository;
    private final TeamRepository teamRepository;
    private final CategoryRepository categoryRepository;

    @GetMapping("/customers")
    public ResponseEntity<List<Map<String, Object>>> getCustomers() {
        List<Map<String, Object>> result = customerRepository.findAll().stream().map(c -> {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("id", c.getId());
            map.put("name", c.getUser().getFullName());
            map.put("email", c.getUser().getEmail());
            map.put("companyName", c.getCompanyName());
            map.put("accountTier", c.getAccountTier());
            return map;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/agents")
    public ResponseEntity<List<Map<String, Object>>> getAgents() {
        List<Map<String, Object>> result = agentRepository.findAll().stream().map(a -> {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("id", a.getId());
            map.put("name", a.getUser().getFullName());
            map.put("email", a.getUser().getEmail());
            map.put("tierLevel", a.getTierLevel());
            map.put("teamId", a.getTeam() != null ? a.getTeam().getId() : null);
            map.put("teamName", a.getTeam() != null ? a.getTeam().getName() : "Unassigned");
            map.put("isAvailable", a.getIsAvailable());
            return map;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/teams")
    public ResponseEntity<List<Team>> getTeams() {
        return ResponseEntity.ok(teamRepository.findAll());
    }

    @GetMapping("/categories")
    public ResponseEntity<List<Category>> getCategories() {
        return ResponseEntity.ok(categoryRepository.findAll());
    }
}
