package com.senac.AulaFullStack.domain.entity;

import com.senac.AulaFullStack.application.dto.aluno.AlunoRequestDto;
import com.senac.AulaFullStack.application.dto.aluno.AlunoResponseDto;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "alunos")
public class Aluno {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String idString;
    private String nomeCompleto;
    private String sexo;
    private int idade;
    private String enderecoResidencial;
    private String tipoAlimentar;
    private String alergia;
    private String deficiencia;
    private String statusEmbarque;

    @ManyToOne
    @JoinColumn(name="parada_id", nullable = true)
    private Parada parada;

    @ManyToOne
    @JoinColumn(name="onibus_id", nullable = true)
    private Onibus onibus;

    public Aluno(AlunoRequestDto dto, Parada parada, Onibus onibus) {
        this.idString = dto.idString();
        this.nomeCompleto = dto.nomeCompleto();
        this.sexo = dto.sexo();
        this.idade = dto.idade();
        this.enderecoResidencial = dto.enderecoResidencial();
        this.tipoAlimentar = dto.tipoAlimentar();
        this.alergia = dto.alergia();
        this.deficiencia = dto.deficiencia();
        this.statusEmbarque = "aguardando";
        this.parada = parada;
        this.onibus = onibus;
    }

    public AlunoResponseDto toDto() {
        return new AlunoResponseDto(
                id,
                idString,
                nomeCompleto,
                sexo,
                idade,
                enderecoResidencial,
                tipoAlimentar,
                alergia,
                deficiencia,
                statusEmbarque,
                parada != null ? parada.getId() : null,
                parada != null ? parada.getNome() : null,
                onibus != null ? onibus.getId() : null,
                onibus != null ? onibus.getNome() : null
        );
    }
}