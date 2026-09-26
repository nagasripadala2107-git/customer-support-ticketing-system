package com.supportdesk.ticketing.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "escalation_edges", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"from_level_id", "to_level_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EscalationEdge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "from_level_id", nullable = false)
    private EscalationLevel fromLevel;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "to_level_id", nullable = false)
    private EscalationLevel toLevel;

    @Column(nullable = false)
    private Integer weight = 1;

    @Column(name = "condition_description", columnDefinition = "TEXT")
    private String conditionDescription;
}
