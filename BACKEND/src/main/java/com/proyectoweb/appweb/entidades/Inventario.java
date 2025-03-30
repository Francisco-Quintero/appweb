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
@Table(name = "inventario")
@Getter
@Setter
public class Inventario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_inventario")
    private Long id;

    @Column(name = "stock")
    private int stock;

    @Column(name = "punto_reorden")
    private int puntoReorden;

    @OneToOne
    @JoinColumn(name = "id_producto")
    private Producto producto;
}

