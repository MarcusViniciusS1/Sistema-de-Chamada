// src/main/java/com/senac/AulaFullStack/domain/entity/Aluno.java
package com.senac.AulaFullStack.domain.entity;

import jakarta.persistence.*;
import lombok.Data;
// ... imports

@Entity
@Data
@Table(name= "alunos")
public class Aluno {
    public enum Sexo { MASCULINO, FEMININO }
    public enum TipoAlimentar { SEM_RESTRICAO, VEGETARIANO, DIABETICO, PASTOSO, OUTRO }
    public enum StatusEmbarque { AGUARDANDO, EMBARCOU, FALTOU, FORA_PADRAO }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nomeCompleto;
    @Enumerated(EnumType.STRING) private Sexo sexo;
    private Integer idade;
    private String enderecoResidencial;
    @Enumerated(EnumType.STRING) private TipoAlimentar tipoAlimentar;
    private String alergia;
    private String deficiencia;
    @Enumerated(EnumType.STRING) private StatusEmbarque statusEmbarque;

    @ManyToOne
    @JoinColumn(name="parada_id")
    private Parada parada;
    // ... construtores
}