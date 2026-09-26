package com.supportdesk.ticketing.services;

import com.supportdesk.ticketing.entities.*;
import com.supportdesk.ticketing.repositories.AgentRepository;
import com.supportdesk.ticketing.repositories.TeamRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Routes tickets to departmental support teams and assigns an available agent.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class RoutingService {

    private final TeamRepository teamRepository;
    private final AgentRepository agentRepository;

    @Transactional(readOnly = true)
    public Team determineTargetTeam(Category category) {
        if (category != null && category.getDefaultTeam() != null) {
            return category.getDefaultTeam();
        }

        String categoryCode = category != null ? category.getCode() : "GENERAL_INQUIRY";
        String teamCode = switch (categoryCode) {
            case "BILLING", "REFUND" -> "BILLING_TEAM";
            case "TECHNICAL_SUPPORT" -> "TECH_SUPPORT_TEAM";
            case "ACCOUNT_ACCESS" -> "ACCOUNT_SECURITY_TEAM";
            case "SHIPPING" -> "SHIPPING_TEAM";
            case "PRODUCT_ISSUE" -> "PRODUCT_SUPPORT_TEAM";
            default -> "TECH_SUPPORT_TEAM";
        };

        return teamRepository.findByCode(teamCode)
                .orElseGet(() -> teamRepository.findAll().stream().findFirst().orElse(null));
    }

    @Transactional(readOnly = true)
    public Agent selectBestAgent(Team team) {
        if (team == null) return null;

        List<Agent> availableAgents = agentRepository.findByTeamIdAndIsAvailableTrue(team.getId());
        if (availableAgents.isEmpty()) {
            availableAgents = agentRepository.findByTeamId(team.getId());
        }

        if (availableAgents.isEmpty()) {
            return null;
        }

        // Return agent with capacity (least busy or first available)
        return availableAgents.get(0);
    }
}
