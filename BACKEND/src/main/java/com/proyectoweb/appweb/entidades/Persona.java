package com.proyectoweb.appweb.entidades;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Persona {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long idPersona;
    private String identificacion;
    private String nombre;
    private String apellido;
    private Long telefono;
}
