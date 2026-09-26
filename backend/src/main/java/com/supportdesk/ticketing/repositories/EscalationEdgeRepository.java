package com.supportdesk.ticketing.repositories;

import com.supportdesk.ticketing.entities.EscalationEdge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EscalationEdgeRepository extends JpaRepository<EscalationEdge, Long> {
    List<EscalationEdge> findByFromLevelId(Long fromLevelId);
}
