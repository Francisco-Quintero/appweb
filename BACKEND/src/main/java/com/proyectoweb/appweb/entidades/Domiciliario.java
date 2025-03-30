package com.proyectoweb.appweb.entidades;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "domiciliario")
@Getter
@Setter
public class Domiciliario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_domiciliario")
    private Long idDomiciliario;

    @Column(name = "disponibilidad")
    private String disponibilidad;

    @OneToOne
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;
}

