package com.senac.AulaFullStack.domain.entity;

import com.senac.AulaFullStack.application.dto.onibus.OnibusResponseDto;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "onibus")
public class Onibus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String idString;
    private String nome;
    private String motorista;
    private String placa;
    private String cor;
    private int capacidadeMaxima;
    private boolean suporteDeficiencia;
    private int paradaAtual;
    private int quantidadeParadas;

    @OneToMany(mappedBy = "onibus", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Usuario> coordenadoras;

    @OneToMany(mappedBy = "onibus", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("ordem ASC")
    private List<Parada> rota;

    public OnibusResponseDto toDto() {
        // Estes 10 campos coincidem com o OnibusResponseDto
        return new OnibusResponseDto(
                id,
                idString,
                nome,
                motorista,
                placa,
                cor,
                capacidadeMaxima,
                suporteDeficiencia,
                paradaAtual,
                quantidadeParadas
        );
    }
}