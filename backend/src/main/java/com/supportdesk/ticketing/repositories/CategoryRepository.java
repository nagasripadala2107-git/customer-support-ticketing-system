package com.supportdesk.ticketing.repositories;

import com.supportdesk.ticketing.entities.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    Optional<Category> findByCode(String code);
    Optional<Category> findByName(String name);
}
