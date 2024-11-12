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
public class Inventario {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private int stock;
    private int puntoReorden;

    @OneToOne
    private Producto producto;
}

