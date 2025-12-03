package com.senac.AulaFullStack.domain.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "registros_embarque")
public class RegistroEmbarque {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String alunoIdString;
    private String status;
    private LocalDateTime timestamp;
    private String motivo;

    @ManyToOne
    @JoinColumn(name="aluno_id", nullable = false)
    private Aluno aluno;

    @ManyToOne
    @JoinColumn(name="parada_id", nullable = false)
    private Parada parada;

    @ManyToOne
    @JoinColumn(name="onibus_id", nullable = false)
    private Onibus onibus;

    @ManyToOne
    @JoinColumn(name="usuario_id", nullable = false)
    private Usuario monitora;
}