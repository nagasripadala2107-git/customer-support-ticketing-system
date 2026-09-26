package com.supportdesk.ticketing.repositories;

import com.supportdesk.ticketing.entities.Ticket;
import com.supportdesk.ticketing.entities.TicketPriority;
import com.supportdesk.ticketing.entities.TicketStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    Optional<Ticket> findByTicketNumber(String ticketNumber);

    List<Ticket> findByCustomerIdOrderByCreatedAtDesc(Long customerId);

    List<Ticket> findByAssignedAgentIdOrderByCreatedAtDesc(Long agentId);

    List<Ticket> findByAssignedTeamIdOrderByCreatedAtDesc(Long teamId);

    List<Ticket> findByStatusOrderByCreatedAtDesc(TicketStatus status);

    List<Ticket> findByPriorityOrderByCreatedAtDesc(TicketPriority priority);

    long countByStatus(TicketStatus status);

    long countByPriority(TicketPriority priority);

    long countByAssignedAgentIdAndStatus(Long agentId, TicketStatus status);

    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.status != com.supportdesk.ticketing.entities.TicketStatus.CLOSED AND t.status != com.supportdesk.ticketing.entities.TicketStatus.RESOLVED")
    long countActiveTickets();

    @Query("SELECT t.category.name, COUNT(t) FROM Ticket t GROUP BY t.category.name")
    List<Object[]> countTicketsByCategory();

    @Query("SELECT t.status, COUNT(t) FROM Ticket t GROUP BY t.status")
    List<Object[]> countTicketsByStatusGroup();

    @Query("SELECT t.priority, COUNT(t) FROM Ticket t GROUP BY t.priority")
    List<Object[]> countTicketsByPriorityGroup();

    @Query("SELECT t FROM Ticket t WHERE " +
           "(:status IS NULL OR t.status = :status) AND " +
           "(:priority IS NULL OR t.priority = :priority) AND " +
           "(:categoryId IS NULL OR t.category.id = :categoryId) AND " +
           "(:teamId IS NULL OR t.assignedTeam.id = :teamId) AND " +
           "(:search IS NULL OR LOWER(t.subject) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(t.ticketNumber) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Ticket> searchTickets(
            @Param("status") TicketStatus status,
            @Param("priority") TicketPriority priority,
            @Param("categoryId") Long categoryId,
            @Param("teamId") Long teamId,
            @Param("search") String search
    );
}
