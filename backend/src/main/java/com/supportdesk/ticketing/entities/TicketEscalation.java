package com.supportdesk.ticketing.entities;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "ticket_escalations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TicketEscalation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticket_id", nullable = false)
    private Ticket ticket;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "from_level_id", nullable = false)
    private EscalationLevel fromLevel;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "to_level_id", nullable = false)
    private EscalationLevel toLevel;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "escalated_by_user_id", nullable = false)
    private User escalatedByUser;

    @Column(name = "escalation_reason", columnDefinition = "TEXT", nullable = false)
    private String escalationReason;

    @Column(name = "path_taken")
    private String pathTaken; // e.g. "L1_SUPPORT -> L2_SUPPORT -> TECHNICAL_TEAM"

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
