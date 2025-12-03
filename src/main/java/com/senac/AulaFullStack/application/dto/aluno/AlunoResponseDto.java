package com.senac.AulaFullStack.application.dto.aluno;

public record AlunoResponseDto(
        Long id,
        String idString,
        String nomeCompleto,
        String sexo,
        int idade,
        String enderecoResidencial,
        String tipoAlimentar,
        String alergia,
        String deficiencia,
        String statusEmbarque,
        Long paradaId,
        String paradaNome,
        Long onibusId,
        String onibusNome
) {}