package com.senac.AulaFullStack.domain.repository;

import com.senac.AulaFullStack.domain.entity.RegistroEmbarque;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RegistroEmbarqueRepository extends JpaRepository<RegistroEmbarque, Long> {}