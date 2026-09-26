package com.supportdesk.ticketing.repositories;

import com.supportdesk.ticketing.entities.TicketEscalation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketEscalationRepository extends JpaRepository<TicketEscalation, Long> {
    List<TicketEscalation> findByTicketIdOrderByCreatedAtAsc(Long ticketId);
}
