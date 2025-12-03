package com.senac.AulaFullStack.application.dto.usuario;

public record UsuarioRequestEdicao(
        Long id,
        String nome,
        String cpf, // Mantido, mas não será editável no front
        String email,
        String role,
        String telefone,
        Long onibusId // Alterado de empresaId
) {}