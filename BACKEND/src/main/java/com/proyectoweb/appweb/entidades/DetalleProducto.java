package com.proyectoweb.appweb.entidades;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class DetalleProducto {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long idDetalle;
    private int cantidad;
    private Double descuento;

    @ManyToOne
    private Producto producto;
}

