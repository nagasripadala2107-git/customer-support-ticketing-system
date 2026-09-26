package com.supportdesk.ticketing.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "escalation_levels")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EscalationLevel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "level_code", nullable = false, unique = true)
    private String levelCode; // L1_SUPPORT, L2_SUPPORT, TECHNICAL_TEAM, etc.

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "target_team_id")
    private Team targetTeam;

    @Column(name = "sla_hours", nullable = false)
    private Integer slaHours = 24;
}
