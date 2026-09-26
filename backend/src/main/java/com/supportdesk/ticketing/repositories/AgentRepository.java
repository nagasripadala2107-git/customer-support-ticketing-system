package com.supportdesk.ticketing.repositories;

import com.supportdesk.ticketing.entities.Agent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AgentRepository extends JpaRepository<Agent, Long> {
    Optional<Agent> findByUserId(Long userId);
    List<Agent> findByTeamIdAndIsAvailableTrue(Long teamId);
    List<Agent> findByTeamId(Long teamId);
}
