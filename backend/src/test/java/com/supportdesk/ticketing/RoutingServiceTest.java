package com.supportdesk.ticketing;

import com.supportdesk.ticketing.entities.Category;
import com.supportdesk.ticketing.entities.Team;
import com.supportdesk.ticketing.repositories.AgentRepository;
import com.supportdesk.ticketing.repositories.TeamRepository;
import com.supportdesk.ticketing.services.RoutingService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("Routing Service Test Suite")
class RoutingServiceTest {

    @Mock
    private TeamRepository teamRepository;

    @Mock
    private AgentRepository agentRepository;

    @InjectMocks
    private RoutingService routingService;

    @Test
    @DisplayName("Verify Billing Category routes to Billing Team")
    void testDetermineTargetTeamForBilling() {
        Category billingCategory = Category.builder()
                .code("BILLING")
                .name("Billing & Invoicing")
                .build();

        Team billingTeam = Team.builder()
                .id(1L)
                .code("BILLING_TEAM")
                .name("Billing & Finance Team")
                .build();

        when(teamRepository.findByCode("BILLING_TEAM")).thenReturn(Optional.of(billingTeam));

        Team result = routingService.determineTargetTeam(billingCategory);

        assertNotNull(result);
        assertEquals("BILLING_TEAM", result.getCode());
    }
}
