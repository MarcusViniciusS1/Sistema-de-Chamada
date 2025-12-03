package com.senac.AulaFullStack.application.dto.aluno;

public record AlunoRequestDto(
        String idString,
        String nomeCompleto,
        String sexo,
        int idade,
        String enderecoResidencial,
        String tipoAlimentar,
        String alergia,
        String deficiencia,
        Long paradaId
) {}