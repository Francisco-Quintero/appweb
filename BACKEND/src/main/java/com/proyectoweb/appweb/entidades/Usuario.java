package com.proyectoweb.appweb.entidades;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "usuario")
@Getter
@Setter
@Inheritance(strategy = InheritanceType.JOINED) // Configuración para herencia
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Long id;

    @Column(name = "username", nullable = false, unique = true)
    private String username;

    @Column(name = "password", nullable = false)
    private String password;
    
    // Relación con la tabla de roles
    @ManyToOne
    @JoinColumn(name = "id_rol", nullable = false)
    private Rol rol;

    // Atributos de Persona
    @Column(name = "nombre", nullable = false)
    private String nombre;

    @Column(name = "apellido", nullable = false)
    private String apellido;

    @Column(name = "telefono", nullable = false)
    private String telefono;

    @Column(name = "direccion", nullable = false)
    private String direccion;

    @Column(name = "email", nullable = false, unique = true)
    private String email;
}