package com.senac.AulaFullStack.domain.entity;

import com.senac.AulaFullStack.application.dto.parada.ParadaResponseDto;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "paradas")
public class Parada {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String idString;
    private String nome;
    private String endereco;
    private double latitude;
    private double longitude;
    private int ordem;

    @ManyToOne
    @JoinColumn(name="onibus_id", nullable = true)
    private Onibus onibus;

    @OneToMany(mappedBy = "parada", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Aluno> alunos;

    public ParadaResponseDto toDto() {
        return new ParadaResponseDto(
                id, idString, nome, endereco, latitude, longitude, ordem,
                onibus != null ? onibus.getId() : null,
                (long) (alunos != null ? alunos.size() : 0)
        );
    }
}