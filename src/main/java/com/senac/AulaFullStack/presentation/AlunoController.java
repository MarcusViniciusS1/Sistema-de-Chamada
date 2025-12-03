package com.senac.AulaFullStack.presentation;

import com.senac.AulaFullStack.application.dto.aluno.AlunoResponseDto;
import com.senac.AulaFullStack.application.services.AlunoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/alunos")
@Tag(name = "Gestão de Alunos", description = "CRUD e Listagem de Alunos")
public class AlunoController {

    @Autowired private AlunoService alunoService;

    @GetMapping
    @Operation(summary = "Lista todos os alunos do banco de dados", description = "Pode ser acessado por ADMIN, COORDENADORA, REFEITORIO, COORDENADOR_PORTA.")
    public ResponseEntity<List<AlunoResponseDto>> listarTodos() {
        return ResponseEntity.ok(alunoService.listarTodos());
    }

    // Outros endpoints de CRUD (POST, PUT, DELETE) para ADMIN devem ser adicionados aqui.
}