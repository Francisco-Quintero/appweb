package com.proyectoweb.appweb.entidades;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "rol")
@Getter
@Setter
public class Rol {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_rol")
    private Long id;

    @Column(name = "nombre", nullable = false, unique = true)
    private String nombre;

    public Rol() {}

    public Rol(Long id) {
        this.id = id;
    }
}
