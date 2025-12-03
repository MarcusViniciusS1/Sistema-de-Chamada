package com.senac.AulaFullStack.application.dto.parada;

public record ParadaResponseDto(
        Long id,
        String idString,
        String nome,
        String endereco,
        double latitude,
        double longitude,
        int ordem,
        Long onibusId,
        Long alunosEsperados
) {}