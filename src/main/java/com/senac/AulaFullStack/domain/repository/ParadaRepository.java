package com.senac.AulaFullStack.domain.repository;

import com.senac.AulaFullStack.domain.entity.Parada;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ParadaRepository extends JpaRepository<Parada, Long> {
    Optional<Parada> findByIdString(String idString);
    List<Parada> findByOnibusIdOrderByOrdemAsc(Long onibusId);
}