package com.proyectoweb.appweb.entidades;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Domiciliario {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long idDomiciliario;
    private String disponibilidad;

    @OneToOne
    private Persona persona;
}

