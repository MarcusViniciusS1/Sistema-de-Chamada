package com.senac.AulaFullStack.domain.repository;

import com.senac.AulaFullStack.domain.entity.Aluno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AlunoRepository extends JpaRepository<Aluno, Long> {
    Optional<Aluno> findByIdString(String idString);
    List<Aluno> findByOnibusId(Long onibusId);
    List<Aluno> findByStatusEmbarque(String statusEmbarque);
    List<Aluno> findByParadaId(Long paradaId);
}