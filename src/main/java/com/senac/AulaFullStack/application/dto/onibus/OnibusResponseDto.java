package com.senac.AulaFullStack.application.dto.onibus;

public record OnibusResponseDto(
        Long id,
        String idString,
        String nome,
        String motorista,
        String placa,
        String cor,
        int capacidadeMaxima,
        boolean suporteDeficiencia,
        int paradaAtual,
        int quantidadeParadas
) {}