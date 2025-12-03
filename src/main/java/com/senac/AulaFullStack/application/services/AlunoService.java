package com.senac.AulaFullStack.application.services;

import com.senac.AulaFullStack.application.dto.aluno.AlunoResponseDto;
import com.senac.AulaFullStack.domain.entity.Aluno;
import com.senac.AulaFullStack.domain.repository.AlunoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AlunoService {

    @Autowired private AlunoRepository alunoRepository;

    // Lista todos os alunos do banco de dados (Fetch from DB)
    public List<AlunoResponseDto> listarTodos() {
        return alunoRepository.findAll().stream()
                .map(Aluno::toDto)
                .collect(Collectors.toList());
    }
}