package com.senac.AulaFullStack.application.dto.usuario;

import com.senac.AulaFullStack.domain.entity.Usuario;

public record UsuarioResponseDto(Long id, String nome, String email, String role, Long onibusId) {

    public UsuarioResponseDto(Usuario usuario){
        this(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getRole(),
                usuario.getOnibus() != null ? usuario.getOnibus().getId() : null
        );
    }
}