package com.supportdesk.ticketing.repositories;

import com.supportdesk.ticketing.entities.EscalationLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EscalationLevelRepository extends JpaRepository<EscalationLevel, Long> {
    Optional<EscalationLevel> findByLevelCode(String levelCode);
}
